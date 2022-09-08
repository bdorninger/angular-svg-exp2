import { Injectable, Optional } from '@angular/core';

const rect = `<svg id="rect" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100%" height="100%"/></svg>`;

const editdark = `<svg id="editdark" class="inner-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.46082 13.8117L16.316 2.95654L20.9298 7.57037L10.0746 18.4255L5.46082 13.8117ZM2.94385 20.9438L4.25469 15.0178L8.86849 19.6316L2.94385 20.9438Z" />
</svg>`;

const editlight = `<svg id="editlight" class="inner-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.46082 13.8117L16.316 2.95654L20.9298 7.57037L10.0746 18.4255L5.46082 13.8117ZM2.94385 20.9438L4.25469 15.0178L8.86849 19.6316L2.94385 20.9438Z" />
</svg>`;

const svgImages = {
  rect: rect,
  editdark: editdark,
  editlight: editlight,
};

export interface ImgUsage {
  refCount: number;
  img: SVGElement;
}

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private cache?: Map<string, ImgUsage>;

  private cacheRoot?: HTMLElement;

  constructor() {
    this.cache = new Map();
  }

  public async getImage(key?: string): Promise<string | undefined> {
    if (!this.appendSvgCacheElement()) {
      throw new Error(`No cache elem`);
    }

    if (key == null) {
      throw new Error(`No resource key specified`);
    }
    if (key.endsWith('jpg')) {
      return '<img src="https://stackblitz.com/files/angular-ivy-rbyhxs/github/bdorninger/angular-svg/master/src/assets/parser.jpg" width="100%" height="100%" />';
    }

    console.log(`------ getImage: ${key} ----------------`);
    if (!this.cache.has(key)) {
      const svg = await this.loadImage(key);
      this.cacheImage(key, svg);
    }
    return this.makeUseSvg(key);
  }

  public derefImage(key: string) {
    if (this.cache.has(key)) {
      const usage = this.cache.get(key);
      if (--usage.refCount <= 0) {
        this.cache.delete(key);
        usage.img.remove();
      }
    }
  }

  public cacheImage(key: string, svg?: string) {
    console.log('+++ Caching image', key, svg);
    // cachin is async. meanwhile someone else might have inserted the image. ask the cache again if the image is there
    if (this.cache.has(key)) {
      return this.cache.get(key).img;
    }
    if (svg == null || svg.length <= 0) {
      console.log(` +++ No image data. Cannot cache`);
      return undefined;
    }
    const elem = this.appendSvgToChacheElem(key, svg);
    const initUsage = {
      refCount: 0,
      img: elem,
    };
    this.cache.set(key, initUsage);
    return elem;
  }

  private makeUseSvg(key: string) {
    console.log('wrapping up ', key);
    const usage = this.cache.get(key);
    usage.refCount++;
    const attViewBox = usage.img.getAttribute('viewBox');
    const attWidth = usage.img.getAttribute('width');
    const attHeight = usage.img.getAttribute('height');
    const widthString = attWidth ? `width="${attWidth}"` : '';
    const heightString = attHeight ? `height="${attHeight}"` : '';
    const viewBoxString = attViewBox
      ? `preserveAspectRatio="xMidYMid" viewBox='${attViewBox}'`
      : '';
    return `<svg ${widthString} ${heightString} ${viewBoxString} class="wrap-svg"><use href="#${key}"/></svg>`;
  }

  private async loadImage(key?: string): Promise<string | undefined> {
    const svg: string | undefined = svgImages[key];
    return Promise.resolve(svg);
  }

  private elemCacheHasImage(key: string): boolean {
    const list = this.cacheRoot.getElementsByTagName('svg');
    for (let i = 0; i < list.length; i++) {
      if (list.item(i).getAttribute('id') === key) {
        return true;
      }
    }
    return false;
  }

  private appendSvgToChacheElem(
    key: string,
    svg: string
  ): SVGElement | undefined {
    if (this.hasCacheRoot() && !this.elemCacheHasImage(key)) {
      const template = document.createElement('template');
      template.innerHTML = svg;
      console.log('templ', template.content.firstChild);
      /*
      const svgElem = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );
      */
      //const el = this.cacheRoot?.appendChild(svgElem);
      //svgElem.outerHTML = svg;
      //return svgElem;
      const node = this.cacheRoot?.appendChild(template.content.firstChild);
      return node as SVGElement;
    }
    return undefined;
  }

  private hasCacheRoot(): boolean {
    return document.getElementById('images-cache') != null;
  }

  private appendSvgCacheElement(): boolean {
    if (!this.hasCacheRoot()) {
      const divElemImages = document.createElement(`div`);
      divElemImages.hidden = true;
      divElemImages.id = 'images-cache';
      document.getElementsByTagName('body')[0].appendChild(divElemImages);
      this.cacheRoot = divElemImages;
      console.log('Created cache elem', this.cacheRoot);
    }
    return this.hasCacheRoot();
  }
}
