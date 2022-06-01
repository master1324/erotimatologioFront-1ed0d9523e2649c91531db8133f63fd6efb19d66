import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Directive({
  selector: '[ifRoles]'
})
export class IfRolesDirective {

  private subscription: Subscription[] = [];
  // the role the user must have
  @Input() public ifRoles: Array<string>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) { }


  public ngOnInit(): void {
    this.subscription.push(
      this.authService.getRoles().subscribe(res => {
        if (!res) {
          // Remove element from DOM
          this.viewContainerRef.clear();
        }
        // user Role are checked by a Roles mention in DOM
        const idx = res.findIndex((element) => this.ifRoles.indexOf(element) !== -1);
        if (idx < 0) {
          this.viewContainerRef.clear();
        } else {
          // appends the ref element to DOM
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      })
    );
  }

  /**
   * on destroy cancels the API if its fetching.
   */
  public ngOnDestroy(): void {
    this.subscription.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
