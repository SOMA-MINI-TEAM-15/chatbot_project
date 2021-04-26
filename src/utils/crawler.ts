import puppeteer from 'puppeteer';
import * as HTMLParser from 'node-html-parser';
import { Lock } from './lock';
import { IMentoring } from '../interfaces/soma.interface';

let browser: puppeteer.Browser = null;
let page: puppeteer.Page = null;
const lock = new Lock();
let _isLoggedIn: boolean = true;

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
  //TODO: 불필요한 리소스 막기(img, font, css?)
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

export async function fetchMentorings(pageIndex: number = 1): Promise<any[]> {
  if (pageIndex <= 0) pageIndex = 0;
  const html: string = await getHtml(`https://www.swmaestro.org/sw/mypage/mentoLec/list.do?menuNo=200046&pageIndex=${pageIndex}`);
  const root = HTMLParser.parse(html);
  const [trHeader, ...trs] = root.querySelectorAll('tr');

  return trs.map(tr => {
    const mentoring: IMentoring = {
      //TODO: mentoring 채우기
      title: tr.querySelector('a').text,
    } as IMentoring;
    return mentoring;
  });
}
