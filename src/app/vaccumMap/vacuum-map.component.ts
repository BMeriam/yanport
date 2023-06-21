import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {Position} from "../common/interface/position";

@Component({
    selector: 'app-vacuum-map',
    templateUrl: './vacuum-map.component.html',
    styleUrls: ['./vacuum-map.component.scss'],
    standalone: true,
    imports: [
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NgIf
    ],
})
export class VacuumMapComponent {

    public vacuumForm: FormGroup;
    public currentOrientation: string = "";
    public xPosition: number = 0;
    public yPosition: number = 0;
    public passed: boolean = false;
    public finalDirection: string = '';
    public positionNotValid: boolean = false;
    public lastPosition: Position | undefined;
    public clicked: boolean = false;

    constructor() {
    /**
     * Initialisation du formulaire
     */
        this.vacuumForm = new FormGroup(
            {
                xGrid: new FormControl(
                    '', [Validators.required, Validators.min(0)]),

                yGrid: new FormControl(
                    '', [Validators.required, Validators.min(0)]),

                xPosition: new FormControl(
                    '', [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]),

                yPosition: new FormControl(
                    '', [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]),

                orientation: new FormControl(
                    '', [Validators.required]),

                instruction: new FormControl(
                    '', [Validators.required, Validators.minLength(1)]),
            },
        )
    }


    /**
   * verifie si l'orientation saisie est valide
   * met le champ en erreur si la saisie est erronée
   * Les valeurs acceptées sont N-S-E-O
   * @param orientation
   */
    public checkOrientation(orientation: string): void {
        if (orientation?.toUpperCase() === 'N'
      || (orientation?.toUpperCase() == 'S')
      || orientation?.toUpperCase() == 'E'
      || orientation?.toUpperCase() == 'O') {
            this.vacuumForm.get('orientation')?.setErrors(null);
        } else {
            this.vacuumForm?.get('orientation')?.setErrors({'incorrect': true} as ValidationErrors);
        }
    }

    /**
   * verifie si l'instruction saisie est valide
   * met le champ en erreur si la saisie est erronée
   * @param instruction
   */
    public checkInstruction(instruction: string): void {
        if (instruction?.search(/[^e-fE-F]+/) === -1 || (instruction?.search(/[^b-cB-C]+/))
      || instruction?.search(/[^h-zH-Z]+/) === -1) {
            this.vacuumForm.get('instruction')?.setErrors({'incorrect': true} as ValidationErrors);
        } else {
            this.vacuumForm.get('instruction')?.setErrors(null);
        }
    }

    /**
   * valide le saisie du formulaire et retourne la position finale de l'aspirateur
   */
    public validate() {
        this.clicked = true ;
        const position = this.createPositionModel(
            this.vacuumForm.get('xPosition')?.value,
            this.vacuumForm.get('yPosition')?.value,
            this.vacuumForm.get('orientation')?.value.toUpperCase()
        );
        if(this.currentOrientation=== ''){
            this.currentOrientation = position.orientation;
        }
        const instruction = this.vacuumForm.get('instruction')?.value.toUpperCase();
        const orientationInitial = position.orientation;
        const instructionArray = [...instruction];
        instructionArray.forEach((step) => {
            if (step === 'D' || step === 'G') {
                this.setNextDirection(step, orientationInitial);
            }
            if (step == 'A') {
                this.setNextPosition(this.currentOrientation)
            }
        });

    }

    /**
   * calcule la nouvelle direction
   * @param direction
   * @param orientationInitiale
   * @private
   */
    private setNextDirection(direction: string, orientationInitiale: string) {

        if (this.currentOrientation !== '') {
            orientationInitiale = this.currentOrientation;
        }
        this.move(orientationInitiale, false, direction.toUpperCase());

    }

    /**
   *@ calcule la nouvelle position et verifie si la position est dans la grille
   * @param finalDirection
   * @private
   */
    private setNextPosition(finalDirection: string)  {
        if (this.xPosition === 0 && !this.passed) {
            this.xPosition = this.vacuumForm.get('xPosition')?.value;
        }
        if (this.yPosition === 0 && !this.passed) {
            this.yPosition = this.vacuumForm.get('yPosition')?.value;
        }
        this.move(finalDirection, true);
        this.finalDirection = finalDirection;
        this.lastPosition = this.createPositionModel(this.xPosition, this.yPosition, finalDirection);
        this.checkIfVacuumInGrid();
    }

    /**
   * cree l'objet des coordonnees du robot
   * @param xPosition 
   * @param yPosition 
   * @param orientation
   */
    public createPositionModel(xPosition : number, yPosition: number, orientation : string): Position {

        return {
            x: xPosition,
            y: yPosition,
            orientation: orientation
        }
    }

    /**
   * calcule les nouvelles coordonnees et la nouvelle orientation
   * @param orientation
   * @param coord
   * @param direction
   */
    public move(orientation: string, coord: boolean, direction?: string) {

        switch (orientation) {
            case 'N': {
                if (coord) {
                    this.passed = true;
                    this.yPosition += 1;
                } else {
                    if (direction === 'D') {
                        this.currentOrientation = 'E'
                    } else if (direction == 'G') {
                        this.currentOrientation = ('O')
                    }
                }
                break;
            }
            case 'S': {
                if (coord) {
                    this.passed = true;
                    this.yPosition -= 1;
                } else {
                    if (direction === 'D') {
                        this.currentOrientation = ('O')
                    } else if (direction == 'G') {
                        this.currentOrientation = ('E')
                    }
                }
                break;
            }
            case 'E': {
                if (coord) {
                    this.passed = true;
                    this.xPosition += 1;
                } else {
                    if (direction === 'D') {
                        this.currentOrientation = ('S')
                    } else if (direction == 'G') {
                        this.currentOrientation = ('N')
                    }
                }
                break;
            }
            case 'O': {
                if (coord) {
                    this.passed = true;
                    this.xPosition -= 1;
                } else {
                    if (direction === 'D') {
                        this.currentOrientation = ('N')
                    } else if (direction == 'G') {
                        this.currentOrientation = ('S')
                    }
                }
                break;
            }
            default: {
                break;
            }

        }
    }


    /**
   * verifie si la position retourné est incluse dans la grille
   */
    public checkIfVacuumInGrid() {
        if(this.lastPosition) {
            if (this.vacuumForm.get('xGrid')?.value < this.lastPosition.x
      || this.lastPosition.x < 0
      || this.lastPosition.y < 0
      || this.lastPosition.y > this.vacuumForm.get('yGrid')?.value) {
                this.positionNotValid = true;
            }
        }
    }

    /**
   * RAZ du formulaire et des variables de postion et d'orientation
   */
    resetForm() {
        this.vacuumForm.reset();
        this.xPosition = 0;
        this.yPosition = 0;
        this.currentOrientation = "";
        this.passed = false;
        this.finalDirection = '';
        this.positionNotValid = false;
        this.lastPosition = undefined ;
        this.clicked = false;
    }
}
