import { Dialog } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GameManager, gameManager } from 'src/app/game/businesslogic/GameManager';
import { SettingsManager, settingsManager } from 'src/app/game/businesslogic/SettingsManager';
import { AttackModifierType } from 'src/app/game/model/data/AttackModifier';
import { Condition, ConditionName, ConditionType, EntityCondition } from 'src/app/game/model/data/Condition';
import { EntityValueFunction } from 'src/app/game/model/Entity';
import { Monster } from 'src/app/game/model/Monster';
import { MonsterEntity } from 'src/app/game/model/MonsterEntity';
import { Summon, SummonState } from 'src/app/game/model/Summon';
import { ghsDefaultDialogPositions } from 'src/app/ui/helper/Static';
import { EntityMenuDialogComponent } from '../entity-menu/entity-menu-dialog';
import { MonsterNumberPickerDialog } from '../monster/dialogs/numberpicker-dialog';
import { Subscription } from 'rxjs';
import { ObjectiveEntity } from 'src/app/game/model/ObjectiveEntity';
import { ObjectiveContainer } from 'src/app/game/model/ObjectiveContainer';
import { ActionHint } from 'src/app/game/model/data/Action';

@Component({
  selector: 'ghs-standee',
  templateUrl: './standee.html',
  styleUrls: ['./standee.scss']
})
export class StandeeComponent implements OnInit, OnDestroy {

  @ViewChild('standee') standee!: ElementRef;

  gameManager: GameManager = gameManager;
  settingsManager: SettingsManager = settingsManager;
  @Input() figure!: Monster | ObjectiveContainer;
  @Input() entity!: MonsterEntity | ObjectiveEntity;
  Conditions = Condition;
  AttackModifierType = AttackModifierType;
  SummonState = SummonState;
  ConditionName = ConditionName;
  ConditionType = ConditionType;

  health: number = 0;
  maxHp: number = 0;

  activeConditions: EntityCondition[] = [];

  actionHints: ActionHint[] = [];

  EntityValueFunction = EntityValueFunction;

  constructor(private element: ElementRef, private dialog: Dialog, private overlay: Overlay) { }

  ngOnInit(): void {
    this.uiChangeSubscription = gameManager.uiChange.subscribe({ next: () => this.update() });
    this.update();
  }

  uiChangeSubscription: Subscription | undefined;

  ngOnDestroy(): void {
    if (this.uiChangeSubscription) {
      this.uiChangeSubscription.unsubscribe();
    }
  }

  additionalType(): string {
    return this.entity instanceof MonsterEntity ? this.entity.type : (this.entity instanceof Summon ? this.entity.name : "");
  }

  update(): void {
    this.activeConditions = gameManager.entityManager.activeConditions(this.entity, true);
    this.entity.immunities.forEach((immunity) => {
      if (!this.activeConditions.find((entityCondition) => entityCondition.name == immunity)) {
        this.activeConditions.push(new EntityCondition(immunity));
      }
    })
    this.actionHints = [];

    if (settingsManager.settings.standeeStats && this.figure instanceof Monster && this.entity instanceof MonsterEntity) {
      this.actionHints = gameManager.monsterManager.calcActionHints(this.figure, this.entity);
    }
  }

  dragHpMove(value: number) {
    if (EntityValueFunction(this.entity.maxHealth) > 0 && (!(this.figure instanceof Monster) || !this.figure.immortal)) {
      this.health = value;
      if (this.entity.health + this.health > EntityValueFunction(this.entity.maxHealth)) {
        this.health = EntityValueFunction(this.entity.maxHealth) - this.entity.health;
      }
    }
  }

  dragHpEnd(value: number) {
    if (this.health != 0 && EntityValueFunction(this.entity.maxHealth) > 0 && (!(this.figure instanceof Monster) || !this.figure.immortal)) {
      gameManager.stateManager.before(this.figure.type + "ChangeEntityHp", this.figure.name, "" + this.entity.number, "" + this.health, this.additionalType());
      gameManager.entityManager.changeHealth(this.entity, this.figure, this.health);

      if (this.figure instanceof Monster && this.figure.entities.every((monsterEntity) => monsterEntity.dead)) {
        if (this.figure.active) {
          gameManager.roundManager.toggleFigure(this.figure);
        }
      }

      gameManager.stateManager.after();
    }
    this.health = 0;
  }

  doubleClick(event: any): void {
    if (settingsManager.settings.activeStandees) {
      gameManager.stateManager.before(this.figure.type + (this.entity.active ? "UnsetEntityActive" : "SetEntityActive"), this.figure.name, "" + this.entity.number, this.additionalType());
      gameManager.entityManager.toggleActive(this.figure, this.entity);
      gameManager.stateManager.after();
    }
  }

  openEntityMenu(event: any): void {
    if (this.entity.number < 0 && this.figure instanceof Monster && this.entity instanceof MonsterEntity) {
      const max = gameManager.monsterManager.monsterStandeeMax(this.figure);
      if (settingsManager.settings.randomStandees) {
        let number = Math.floor(Math.random() * max) + 1;
        while (gameManager.monsterManager.monsterStandeeUsed(this.figure, number)) {
          number = Math.floor(Math.random() * max) + 1;
        }
        gameManager.stateManager.before("addRandomStandee", "data.monster." + this.figure.name, "monster." + this.entity.type, "" + number);
        this.entity.number = number;
        gameManager.stateManager.after();
      } else {
        this.dialog.open(MonsterNumberPickerDialog, {
          panelClass: 'dialog',
          data: {
            monster: this.figure,
            type: this.entity.type,
            range: [],
            entity: this.entity,
            entities: this.figure.entities
          },
          positionStrategy: this.overlay.position().flexibleConnectedTo(this.standee).withPositions(ghsDefaultDialogPositions())
        })
      }
    } else {
      const dialogRef = this.dialog.open(EntityMenuDialogComponent, {
        panelClass: 'dialog',
        data: {
          entity: this.entity,
          figure: this.figure,
          positionElement: this.standee
        },
        positionStrategy: this.overlay.position().flexibleConnectedTo(this.standee).withPositions(ghsDefaultDialogPositions())
      });

      dialogRef.closed.subscribe({
        next: () => {
          if ((this.entity instanceof MonsterEntity || this.entity instanceof ObjectiveEntity) && this.entity.dead) {
            this.element.nativeElement.classList.add('dead');
          }
        }
      })
    }
  }




}