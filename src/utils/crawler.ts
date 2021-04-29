import puppeteer from 'puppeteer';
import { URL } from 'url';
import * as HTMLParser from 'node-html-parser';
import { Lock } from './lock';
import { IMentoring, ISchedule, ISomaUser } from '../interfaces/soma.interface';
import EventEmitter from 'events';
import { addMentoring, getMostRecentMentoring, sendNewMentoringNotification } from '../services/mentoring.service';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import { resolve } from 'path';

export const sleepPromise = promisify(setTimeout);

export const eventEmitter: EventEmitter = new EventEmitter();
let browser: puppeteer.Browser = null;
let page: puppeteer.Page = null;
const lock = new Lock();
let _isLoggedIn = true;

export async function initialize(): Promise<void> {
  console.log('initializing crawler...');
  browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    defaultViewport: { width: 1000, height: 800 }, // 모바일 뷰로 테스트했습니다.
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });
  page = await browser.newPage();
  page.on('dialog', async dialog => {
    const _message: string = dialog.message() || '';
    if (_message.startsWith('로그인이 필요한 페이지입니다.')) {
      _isLoggedIn = false;
    }
    await dialog.dismiss();
  });

  if (process.env.NODE_ENV !== 'test') {
    setTimeout(startCheckingNewMentoringsRoutine, 2000);
  }

  console.log('initialize complete!');
}

async function startCheckingNewMentoringsRoutine() {
  console.log('check new mentoring');
  const rescentLocalMentoring = await getMostRecentMentoring();
  const rescentOnlineMentoring = (await fetchMentorings())[0];
  if (rescentOnlineMentoring && rescentLocalMentoring && rescentOnlineMentoring.id > rescentLocalMentoring.id) {
    console.log('new Mentoring exists');
    const newMentorings: IMentoring[] = [];
    let i = 1;
    while (true) {
      const mentorings = await fetchMentorings(i++);
      const newMentoringsPartial = mentorings.filter(m => m.id > rescentLocalMentoring.id);
      if (newMentoringsPartial.length === 0) break;
      newMentoringsPartial.forEach(m => newMentorings.push(m));
    }
    console.log(`total ${newMentorings.length} new Mentorings`);
    for (const newMentoring of newMentorings) {
      const { content, mentoringLocation } = await fetchMentoringDetails(newMentoring.id);
      newMentoring.content = content;
      newMentoring.mentoringLocation = mentoringLocation;
      await addMentoring(newMentoring);
      console.log(`new mentoring: ${newMentoring.id}`);
      sendNewMentoringNotification(newMentoring);
      // eventEmitter.emit('new_mentoring', newMentoring);
    }
  } else {
    console.log('no new Mentorings');
  }
  setTimeout(startCheckingNewMentoringsRoutine, 60 * 1000);
}

export async function getHtml(url: string): Promise<string> {
  await lock.acquire();
  _isLoggedIn = true;
  let res = await page.goto(url);
  if (!_isLoggedIn) {
    await login();
    res = await page.goto(url);
  }
  const html = await res.text();
  lock.release();
  return html;
}

export async function isLoggedIn(): Promise<boolean> {
  const res = await page.goto('https://www.swmaestro.org/sw/main/main.do');
  const html = await res.text();
  const root = HTMLParser.parse(html);
  const loginButton = root.querySelector('button.log_new');
  return loginButton?.getAttribute('title') === '로그아웃';
}

export async function login(): Promise<boolean> {
  await page.goto('https://www.swmaestro.org/sw/member/user/forLogin.do?menuNo=200025');
  await page.waitForSelector('input[name=username]');
  await page.focus('input[name=username]');
  await page.keyboard.type(`${process.env.USERNAME}`);
  await page.waitForSelector('input[name=password]');
  await page.focus('input[name=password]');
  await page.keyboard.type(`${process.env.PASSWORD}`);
  await page.$eval('#login_form', (form: any) => form.submit());
  await page.waitForNavigation();
  const loggedIn = await isLoggedIn();
  if (!loggedIn) throw new Error(`Cannot login!`);
  return loggedIn;
}

// 멘토링 id에 해당하는 멘토링 정보를 멘토링 상세 페이지까지 접속해서 가져오는 함수
export async function fetchMentoringDetails(id: number): Promise<{ mentoringLocation: string; content: string }> {
  const html: string = await getHtml(`https://www.swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=${id}&menuNo=200046`);
  const root = HTMLParser.parse(html);
  return { mentoringLocation: root.querySelectorAll('div.c')[4].textContent.trim(), content: root.querySelector('div.cont').textContent.trim() };
}

export async function fetchMentoringByTypeAndQuery(type: string, query: string): Promise<IMentoring[]> {
  let html: string;

  switch (type) {
    case 'title':
      html = await getHtml(
        `https://swmaestro.org/sw/mypage/mentoLec/list.do?pageIndex=1&menuNo=200046&searchAppGbTy=&searchCnd=1&searchWrd=${query}`,
      );
      break;
    case 'writer':
      html = await getHtml(
        `https://swmaestro.org/sw/mypage/mentoLec/list.do?pageIndex=1&menuNo=200046&searchAppGbTy=&searchCnd=2&searchWrd=${query}`,
      );
      break;
    case 'content':
      html = await getHtml(
        `https://swmaestro.org/sw/mypage/mentoLec/list.do?pageIndex=1&menuNo=200046&searchAppGbTy=&searchCnd=3&searchWrd=${query}`,
      );
      break;
    default:
      break;
  }

  const root = HTMLParser.parse(html);
  const [trHeader, ...trs] = root.querySelectorAll('tr');
  if (trs.length > 0 && trs[0].textContent.trim() === '데이터가 없습니다.') return [];
  return trs.map(tr => {
    const mentoring: IMentoring = {
      id: parseInt(new URL(tr.querySelector('a').getAttribute('href'), 'https://www.swmaestro.org/').searchParams.get('qustnrSn')) || -1,
      title: tr.querySelector('a').text.trim(),
      state: tr.querySelector('td:nth-child(6)').textContent.trim(),
      createdAt: new Date(tr.querySelector('td:nth-child(8)').textContent.trim()),
      mentoringDate: new Date(tr.querySelector('td:nth-child(4)').textContent.trim()),
      appliedCnt: parseInt(tr.querySelector('td:nth-child(5)').textContent.trim()),
      writer: tr.querySelector('td:nth-child(7)').textContent.trim(),
      applyStartDate: new Date(tr.querySelector('td:nth-child(3)').textContent.trim().split('~')[0].trim()),
      applyEndDate: new Date(tr.querySelector('td:nth-child(3)').textContent.trim().split('~')[1].trim()),
    };
    return mentoring;
  });
}

// 페이지 인덱스에 해당하는 멘토링 페이지의 멘토링들을 가져오는 함수(상세페이지 내용은 가져오지 않는다!)
export async function fetchMentorings(pageIndex = 1): Promise<IMentoring[]> {
  if (pageIndex <= 0) pageIndex = 0;
  const html: string = await getHtml(`https://www.swmaestro.org/sw/mypage/mentoLec/list.do?menuNo=200046&pageIndex=${pageIndex}`);
  const root = HTMLParser.parse(html);
  const [trHeader, ...trs] = root.querySelectorAll('tr');
  if (trs.length > 0 && trs[0].textContent.trim() === '데이터가 없습니다.') return [];
  return trs.map(tr => {
    const mentoring: IMentoring = {
      id: parseInt(new URL(tr.querySelector('a').getAttribute('href'), 'https://www.swmaestro.org/').searchParams.get('qustnrSn')) || -1,
      title: tr.querySelector('a').text.trim(),
      state: tr.querySelector('td:nth-child(6)').textContent.trim(),
      createdAt: new Date(tr.querySelector('td:nth-child(8)').textContent.trim()),
      mentoringDate: new Date(tr.querySelector('td:nth-child(4)').textContent.trim()),
      appliedCnt: parseInt(tr.querySelector('td:nth-child(5)').textContent.trim()),
      writer: tr.querySelector('td:nth-child(7)').textContent.trim(),
      applyStartDate: new Date(tr.querySelector('td:nth-child(3)').textContent.trim().split('~')[0].trim()),
      applyEndDate: new Date(tr.querySelector('td:nth-child(3)').textContent.trim().split('~')[1].trim()),
    };
    return mentoring;
  });
}

// 사용자 이름, 관심기술을 가져오는 함수
export async function fetchSomaUsers(userType: 'mentee' | 'mentor' = 'mentee'): Promise<ISomaUser[]> {
  const urls = {
    mentee: 'https://www.swmaestro.org/sw/mypage/myTeam/teamList.do?viewType=CONTBODY&pUserGb=C',
    mentor: 'https://www.swmaestro.org/sw/mypage/myTeam/teamList.do?viewType=CONTBODY&pUserGb=T',
  };

  const html: string = await getHtml(urls[userType]);
  const root = HTMLParser.parse(html);
  const [trHeader, ...trs] = root.querySelectorAll('tr');
  if (trs.length > 0 && trs[0].textContent.trim() === '검색 결과가 없습니다.') return [];
  return trs.map(tr => {
    const name = tr.querySelector('td:nth-child(2)').textContent.trim();
    const majorString = tr.querySelector('td:nth-child(4)').textContent.trim();
    const major = majorString
      ? tr
          .querySelector('td:nth-child(4)')
          .textContent.trim()
          .split(',')
          .map(m => m.trim())
      : [];
    const user: ISomaUser = {
      name,
      major,
      userType,
    };
    return user;
  });
}

// 원하는 년도/월의 일정을 가져오는 함수
export async function fetchSchedules(year = 2021, month = 4): Promise<ISchedule[]> {
  const html: string = await getHtml(
    `https://www.swmaestro.org/sw/mypage/schedule/list.do?menuNo=200043&sYear=${year}&sMonth=${month < 10 ? `0${month}` : month}`,
  );
  const root = HTMLParser.parse(html);
  const [trHeader, ...trs] = root.querySelectorAll('tr');
  if (trs.length > 0 && trs[0].textContent.trim() === '일정이 없습니다.') return [];
  return trs.map(tr => {
    const schedule: ISchedule = {
      title: tr.querySelector('div.rel').childNodes[0].textContent.trim(),
      classification: tr.querySelector('td:nth-child(3)').textContent.trim(),
      startDate: new Date(tr.querySelector('td:nth-child(2)').textContent.trim().split('~')[0]),
      endDate: new Date(tr.querySelector('td:nth-child(2)').textContent.trim().split('~')[1]),
    };
    return schedule;
  });
}

// 아래 함수들은 사용 금지
async function fetchAllMentorings(): Promise<IMentoring[]> {
  let i = 1;
  const retMentorings: IMentoring[] = [];
  while (true) {
    const mentorings = await fetchMentorings(i);
    if (mentorings.length === 0) break;
    console.log(`page: ${i} count: ${mentorings.length}`);
    mentorings.forEach(m => retMentorings.push(m));
    await sleepPromise(500);
    i++;
  }
  return retMentorings;
}

async function saveAllMentorings(): Promise<void> {
  const ret = await fetchAllMentorings();
  const saveDir = resolve('/workspaces/chatbot_project/data', 'mentorings.json');
  await fs.ensureFile(saveDir);
  await fs.writeJson(saveDir, ret);
}

export async function loadAllMentorings(dir: string): Promise<void> {
  const data: IMentoring[] = await fs.readJson(dir);
  console.log(`loaded ${data.length}`);
  for (const mentoring of data) {
    await addMentoring(mentoring);
    console.log(`added id: ${mentoring.id}`);
  }
  console.log('complete');
}
