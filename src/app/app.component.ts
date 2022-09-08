import { Component, OnDestroy, VERSION, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
//
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  name = 'SVG Experiments';

  private _imgObjUrl: SafeUrl;
  private unsafeUrl: string;

  public get imgObjUrl(): SafeUrl {
    const u = this._imgObjUrl;
    this.revokeObject(); // some time after first access revoke the object URL  - but still resuse it - what consequences?
    return u;
  }

  strokeColors = ['#ff00ff', '#00ff00', '#ffffff'];
  ind = 0;

  strokewidth = 10;
  strokeStyle = 'fill:#d2a3ff;stroke:#3983ac';
  cstyle = 'cx:50;cy:50;r:50;fill:#dfac20;stroke:#3983ab;stroke-width:2';

  public currentStrokeColor = '#000000';
  public currentFillColor = '#ffffff';

  public iconactive = [true, false];

  constructor(
    private readonly vc: ViewContainerRef,
    private readonly sanitizer: DomSanitizer
  ) {
    this.unsafeUrl = URL.createObjectURL(
      new Blob(
        [
          `<svg id="objrect" class="objrect" fill="aqua" width="50" height="50" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="50" height="50"/></svg>`,
        ],
        {
          type: 'image/svg+xml',
        }
      )
    );
    this._imgObjUrl = this.sanitizer.bypassSecurityTrustUrl(this.unsafeUrl);
  }

  public ngOnDestroy() {
    // URL.revokeObjectURL(this.unsafeUrl);
  }

  private revokeObject() {
    if (this.unsafeUrl !== undefined) {
      console.log(`Revoking object URL`);
      setTimeout(() => {
        URL.revokeObjectURL(this.unsafeUrl);
      }, 5);
      this.unsafeUrl = undefined;
    }
  }

  public switchColor() {
    this.ind++;
    if (this.ind >= this.strokeColors.length) {
      this.ind = 0;
    }
    this.currentStrokeColor = this.strokeColors[this.ind];
    this.currentFillColor =
      this.strokeColors[(this.ind + 1) % this.strokeColors.length];
    console.log('switched cols');
  }

  public toggleActive(groupId: number) {
    if (groupId >= 0 && groupId < this.iconactive.length) {
      this.iconactive[groupId] = !this.iconactive[groupId];
    }
  }

  public deleteSome() {
    const d = document.getElementById('deletable');
    console.log(d);
    if (d && d.firstChild) {
      // d.firstChild.remove();
      d.remove();
    }
  }
}
