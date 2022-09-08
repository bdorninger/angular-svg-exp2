import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const symbols: { [key: string]: string } = {
  circle: `<svg width="100" height="100">
  <circle
    style="%STYLE%"            
    cx="50"
    cy="50"
    r="50"      
  />
</svg>`,
  rect: `<svg width="100" height="100"><rect style="%STYLE%" x="0" y="0" width="100" height="100"/></svg>`,
};

@Component({
  selector: 'esvg',
  templateUrl: './esvg.component.html',
  styleUrls: ['./esvg.component.css'],
})
export class ESVGComponent implements OnInit {
  constructor(private readonly sanitizer: DomSanitizer) {}

  @Input()
  public key: string;

  @Input()
  public stroke?: string; // = '#ff83ac';

  @Input()
  public fill: string;

  ngOnInit() {}

  svgContent(): SafeHtml {
    let str = symbols[this.key] ?? symbols['circle'];
    str = str.replace(
      '%STYLE%',
      `fill: ${this.fill ? this.fill : '#ff0000'};stroke:${
        this.stroke ? this.stroke : '#3983ac'
      }`
    );
    // console.log('svgContent', str);
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }
}
