import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VacuumMapComponent} from './vacuum-map.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule, ValidationErrors} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {Position} from "../common/interface/position";

describe('FeatureComponent', () => {
  let component: VacuumMapComponent;
  let fixture: ComponentFixture<VacuumMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [MatInputModule, NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NgIf]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VacuumMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('1. test checkOrientation', () => {
    it('1.0- erreur de saisie', () => {
      // @ts-ignore
      spyOn(component.vacuumForm.get('orientation'), 'setErrors');
      component.checkOrientation('X');
      expect(component.vacuumForm.get('orientation')?.setErrors).toHaveBeenCalledWith({'incorrect': true} as ValidationErrors);

    });
    it('1.1- NORD', () => {
      // @ts-ignore
      spyOn(component.vacuumForm.get('orientation'), 'setErrors');
      component.checkOrientation('N');
      expect(component.vacuumForm.get('orientation')?.setErrors).toHaveBeenCalledWith(null);

    });
    it('1.2- SUD', () => {
      // @ts-ignore
      spyOn(component.vacuumForm.get('orientation'), 'setErrors');
      component.checkOrientation('S');
      expect(component.vacuumForm.get('orientation')?.setErrors).toHaveBeenCalledWith(null);

    });
    it('1.3- OUEST', () => {
      // @ts-ignore
      spyOn(component.vacuumForm.get('orientation'), 'setErrors');
      component.checkOrientation('O');
      expect(component.vacuumForm.get('orientation')?.setErrors).toHaveBeenCalledWith(null);

    });
    it('1.4- EST', () => {
      // @ts-ignore
      spyOn(component.vacuumForm.get('orientation'), 'setErrors');
      component.checkOrientation('E');
      expect(component.vacuumForm.get('orientation')?.setErrors).toHaveBeenCalledWith(null);

    });
  });
  describe('2. test checkInstruction', () => {
    it('2.0- instruction valide', () => {
      // @ts-ignore
      spyOn(component.vacuumForm.get('instruction'), 'setErrors');
      component.checkInstruction('DADADADAA');
      expect(component.vacuumForm.get('instruction')?.setErrors).toHaveBeenCalledWith(null);

    });
    it('2.1- erreur de saisie', () => {
      // @ts-ignore
      spyOn(component.vacuumForm.get('instruction'), 'setErrors');
      component.checkInstruction('COUCOU');
      expect(component.vacuumForm.get('instruction')?.setErrors).toHaveBeenCalledWith({'incorrect': true} as ValidationErrors);

    });
  });
  describe('3. test resetForm', () => {
    it('3.0- resetForm is called', () => {
      spyOn(component.vacuumForm, 'reset')
      component.resetForm();
      expect(component.vacuumForm.reset).toHaveBeenCalled();
    });
    it('3.1- vars are dumped', () => {
      component.resetForm();
      expect(component.xPosition).toEqual(0);
      expect(component.yPosition).toEqual(0);
      expect(component.currentOrientation).toEqual("");
      expect(component.passed).toEqual(false);
      expect(component.finalDirection).toEqual("");
      expect(component.positionNotValid).toEqual(false);
      expect(component.lastPosition).toEqual(undefined);
      expect(component.clicked).toEqual(false);
    });
  });
  describe('4. test validate', () => {
    it('4.0- test position final de (0,5,"N")',
      () => {
        component.vacuumForm.get('orientation')?.setValue('N');
        component.vacuumForm.get('xPosition')?.setValue(0);
        component.vacuumForm.get('yPosition')?.setValue(5);
        component.vacuumForm.get('instruction')?.setValue('ADAAADAGA');
        const result = {x: 4, y: 5, orientation: "E"} as Position;
        component.validate();
        // @ts-ignore
        expect(component.lastPosition).toEqual(result)
      });
    it('4.1- test position final de (5,5,"N")',
      () => {
        component.vacuumForm.get('orientation')?.setValue('N');
        component.vacuumForm.get('xPosition')?.setValue(5);
        component.vacuumForm.get('yPosition')?.setValue(5);
        component.vacuumForm.get('instruction')?.setValue('DADADADAA');
        const result = {x: 5, y: 6, orientation: "N"} as Position;
        component.validate();
        // @ts-ignore
        expect(component.lastPosition).toEqual(result)
      });
    it('4.2- test position final de (2,3,"S")',
      () => {
        component.vacuumForm.get('orientation')?.setValue('S');
        component.vacuumForm.get('xPosition')?.setValue(2);
        component.vacuumForm.get('yPosition')?.setValue(3);
        component.vacuumForm.get('instruction')?.setValue('DAGADAGAA');
        const result = {x: 0, y: 0, orientation: "S"} as Position;
        component.validate();
        // @ts-ignore
        expect(component.lastPosition).toEqual(result)
      });
  });
});
