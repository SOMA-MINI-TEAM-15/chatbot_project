import puppeteer from 'puppeteer';
import { URL } from 'url';
import * as HTMLParser from 'node-html-parser';
import { Lock } from './lock';
import { IMentoring, ISchedule } from '../interfaces/soma.interface';
import EventEmitter from 'node:events';
import { addMentoring, getMostRecentMentoring } from '../services/mentoring.service';
import { promisify } from 'util';

const sleepPromise = promisify(setTimeout);

const eventEmitter: EventEmitter = new EventEmitter();
let browser: puppeteer.Browser = null;
let page: puppeteer.Page = null;
const lock = new Lock();
let _isLoggedIn = true;

export async function initialize(): Promise<void> {
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
  setImmediate(startCheckingNewMentoringsRoutine);
  //TODO: 불필요한 리소스 막기(img, font, css?)
}

async function startCheckingNewMentoringsRoutine() {
  const rescentLocalMentoring = await getMostRecentMentoring();
  const rescentOnlineMentoring = await fetchMentorings()[0];
  if (rescentOnlineMentoring && parseInt(rescentOnlineMentoring.id) > parseInt(rescentLocalMentoring.id)) {
    const newMentorings: IMentoring[] = [];
    while (true) {
      const i = 1;
      const mentorings = await fetchMentorings(i);
      const newMentoringsPartial = mentorings.filter(m => parseInt(m.id) > parseInt(rescentLocalMentoring.id));
      if (newMentorings.length == 0) break;
      newMentoringsPartial.forEach(m => newMentorings.push(m));
    }
    for (const newMentoring of newMentorings) {
      await addMentoring(newMentoring);
      eventEmitter.emit('new_mentoring', newMentoring);
    }
  }
  await sleepPromise(60 * 1000);
  setImmediate(startCheckingNewMentoringsRoutine);
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
export async function fetchMentoringWithDetails(id: string): Promise<IMentoring> {
  return null;
}

// 페이지 인덱스에 해당하는 멘토링 페이지의 멘토링들을 가져오는 함수(상세페이지 내용은 가져오지 않는다!)
export async function fetchMentorings(pageIndex = 1): Promise<IMentoring[]> {
  if (pageIndex <= 0) pageIndex = 0;
  const html: string = await getHtml(`https://www.swmaestro.org/sw/mypage/mentoLec/list.do?menuNo=200046&pageIndex=${pageIndex}`);
  const root = HTMLParser.parse(html);
  const [trHeader, ...trs] = root.querySelectorAll('tr');

  return trs.map(tr => {
    const mentoring: IMentoring = {
      id: new URL(tr.querySelector('a').getAttribute('href'), 'https://www.swmaestro.org/').searchParams.get('qustnrSn'),
      title: tr.querySelector('a').text.trim(),
      state: tr.querySelector('td:nth-child(6)').textContent.trim(),
      createdAt: new Date(tr.querySelector('td:nth-child(8)').textContent.trim()),
      mentoringDate: new Date(tr.querySelector('td:nth-child(4)').textContent.trim()),
      appliedCnt: parseInt(tr.querySelector('td:nth-child(5)').textContent.trim()),
      writer: tr.querySelector('td:nth-child(7)').textContent.trim(),
      applyStartDate: new Date(tr.querySelector('td:nth-child(3)').textContent.trim().split('~')[0].trim()),
      applyEndDate: new Date(tr.querySelector('td:nth-child(3)').textContent.trim().split('~')[1].trim()),
    } as IMentoring;
    return mentoring;
  });
}

// 원하는 년도/월의 일정을 가져오는 함수
export async function fetchSchedules(year = 2021, month = 4): Promise<ISchedule[]> {
  return null;
}
