import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'ssvg',
  templateUrl: './ssvg.component.html',
  styleUrls: ['./ssvg.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SSVGComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  public key: string;

  @Input()
  public active = false;

  private mutationObserver: MutationObserver;

  constructor(
    private readonly resourceService: ResourceService,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    //console.log('ctor');
    this.mutationObserver = new MutationObserver(this.mutated.bind(this));
  }

  public ngOnInit(): void {
    //console.log('divinit', this.svgdiv);
  }

  public ngOnDestroy() {
    console.log('destroy', this.key);
    this.mutationObserver.disconnect();
    this.resourceService.derefImage(this.key);
  }

  public ngAfterViewInit(): void {
    this.mutationObserver.observe(this.viewContainerRef.element.nativeElement, {
      childList: true,
    });
    this.resourceService
      .getImage(this.key)
      .then((html) => {
        console.log('got pic', html);
        (this.viewContainerRef.element.nativeElement as HTMLElement).innerHTML =
          html;
        (
          this.viewContainerRef.element.nativeElement as HTMLElement
        ).firstChild.addEventListener('unload', () => {
          console.log('Unloaded', this.key);
        });
      })
      .catch((e) => console.error('No pic', e));
  }

  private mutated(mutations: MutationRecord[], obs: MutationObserver) {
    console.log(`ssvg ${this.key} mutated`, mutations);
  }

  /* NOT USED
  
  public svgContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(rect);
  }*/
}
