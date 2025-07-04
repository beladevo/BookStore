import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GlobalLoader } from './shared/components/global-loader/global-loader';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterTestingModule,
        MatToolbarModule,
        GlobalLoader
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
