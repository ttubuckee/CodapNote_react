export interface UrlData {
  clockcolor: string;
  url: string;
  titleselector: string;
  navselector: string;
}
export const urlReg = [
  /^https:\/\/programmers.co.kr\/learn\/courses\/30\/lessons\/\d{0,}#?$/,
  /^https:\/\/www.acmicpc.net\/problem\/+\d{0,}$/
]
export const urlDataObj: { [key:string]: UrlData } = {
  "https://programmers.co.kr/": {
      "clockcolor": "white",
      "url": "https://programmers.co.kr/",
      "titleselector": "body > div.navbar.navbar-dark.navbar-expand-lg.navbar-application.navbar-breadcrumb > ol > li.active",
      "navselector": "body > div.navbar.navbar-dark.navbar-expand-lg.navbar-application.navbar-breadcrumb > div.navbar-collapse.collapse"
  },
  "https://www.hackerrank.com/": {
      "clockcolor": "black",
      "url": "https://www.hackerrank.com/",
      "titleselector": "#content > div > div > div > div > header > div > div > div.community-header-breadcrumb-items > div > h1 > div > h1",
      "navselector": ".toolbar-left"
  },
  "https://www.acmicpc.net/problem": {
      "clockcolor": "black",
      "url": "https://www.acmicpc.net/",
      "titleselector": "#problem_title",
      "navselector": ".page-header"
  }
};