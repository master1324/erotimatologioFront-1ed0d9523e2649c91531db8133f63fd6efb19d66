import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { QuestionnaireService } from 'src/app/service/questionnaire.service';
import { QuestionnareStatsComponent } from '../questionnare-stats/questionnare-stats.component';
import $ from 'jquery';
import { GenericService } from 'src/app/service/generic.service';
import html2canvas from 'html2canvas';
import jspdf, { jsPDF } from 'jspdf';
import domToPdf from 'dom-to-pdf';

@Component({
  selector: 'app-questionnaire-result',
  templateUrl: './questionnaire-result.component.html',
  styleUrls: ['./questionnaire-result.component.css'],
})
export class QuestionnaireResultComponent implements OnInit {
  public qResultState$: Observable<AppState<Questionnaire>>;
  public resultIsPresent: boolean = false;
  private questionnaireId: number;
  public filter:string;
  readonly DataState = DataState;
  private changeHappendSubscription:Subscription;
  private isFirstTime:boolean =true;
  barChartLegend =false
  options = {
    animation: {
        duration: 0
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1
       }
      }
    }
}

  @ViewChild(QuestionnareStatsComponent) child;

  constructor(
    private questionnaireService: QuestionnaireService,
    private genericService:GenericService,
    private route: ActivatedRoute
  ) {


  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.questionnaireId = params['id'];
      this.filter=params['filter'];
    });
    if(this.filter!= undefined){
      this.initiateBody(this.questionnaireId,this.filter)
      this.resultIsPresent = true;
    }    

   
    
  }

  ngAfterViewInit() {

    if(this.resultIsPresent){
      this.changeHappendSubscription=this.child.changeHappend$.subscribe(
        (response:any) =>{
          if(response){
            console.log(response);
            //this.showChangeHappendDiv("Προστεθήκαν " + this.child.responseDiference + " απαντήσεις")
            this.initiateBody(this.questionnaireId,this.filter)
          }
        }
      )
    }  
  }

  showChangeHappendDiv(message:string){
    $("#change").fadeIn().css("display","inline-block");
    document.getElementById("successMessage").innerHTML = message;
    $('#change').delay(4000).fadeOut('slow');
  }

  public getFilter(filter:string){
    console.log(filter+'apo parentntntntn');   
    this.initiateBody(this.questionnaireId,filter);
    this.filter = filter;
    this.resultIsPresent = true;

    //alagi gia na doulebi kai sta dio states
    if(this.qResultState$ == undefined){
      this.changeHappendSubscription=this.child.changeHappend$.subscribe(
        (response:any) =>{
          if(response){
            this.showChangeHappendDiv("Προστεθήκαν " + this.child.responseDiference + " απαντήσεις")
            if(!this.isFirstTime){
              this.initiateBody(this.questionnaireId,this.filter)
              this.isFirstTime =false;
            }
          }
        }
      )
    }
    

  }

  private initiateBody(id: number, filter: string) {
    this.qResultState$ = this.genericService.$one(id,'/v2/quest/','/results?filter='+filter)
      .pipe(
        map((response) => {        
          this.resultIsPresent = true;       
          return {
            dataState: DataState.LOADED,
            appData: response.data.results,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
        }),
        catchError((error: string) => {
          this.resultIsPresent = true;
          console.log(error);
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }

  // public printPdf(){

  //   let data = document.getElementById('pdf'); 

  //   html2canvas(data, { allowTaint: true }).then(canvas => {
  //     let HTML_Width = canvas.width;
  //     let HTML_Height = canvas.height;
  //     let top_left_margin = 15;
  //     let PDF_Width = HTML_Width + (top_left_margin * 2);
  //     let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
  //     let canvas_image_width = HTML_Width;
  //     let canvas_image_height = HTML_Height;
  //     let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
  //     canvas.getContext('2d');
  //     let imgData = canvas.toDataURL("image/jpeg", 1.0);
  //     let pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
  //     pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
  //     for (let i = 1; i <= totalPDFPages; i++) {
  //       pdf.addPage([PDF_Width, PDF_Height], 'p');
  //       pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
  //     }
  //      pdf.save("HTML-Document.pdf");
  //   });

  // }

  printPdf = () => {
    //let identifiers = document.querySelector('.ident-pdf');
    let element = document.getElementById('pdf'); 
    let html = element.outerHTML;
    console.log(html);
    
    //identifiers.append(element)

    //element.querySelector('.pdf-ignore').remove();
    let options = {
      filename: "test.pdf",
    };
    
    // return domToPdf(element, options, () => {
    //   // callback function
    // });
  }



  public createDataSet(resultMap:Record<string,number>){

    //Math.max.apply(Math, Object.values(resultMap).map(function(o) { return o.y; }))
    let indexOfMaxValue = Object.values(resultMap).reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    let colors = ["rgba(255, 0, 0, 0.5)","rgba(255, 0, 0, 0.5)","rgba(255, 0, 0, 0.5)","rgba(255, 0, 0, 0.5)","rgba(255, 0, 0, 0.5)"]
    let backgroundColor =["rgba(255, 0, 0, 1)","rgba(255, 0, 0, 1)","rgba(255, 0, 0, 1)","rgba(255, 0, 0, 1)","rgba(255, 0, 0,1)"]
    colors[indexOfMaxValue] ="rgba(39, 245, 75, 0.7)"
    backgroundColor[indexOfMaxValue] ="rgba(39, 245, 75, 1)"
    return{
      datasets:[{
        data: resultMap,
        backgroundColor: colors,
        hoverBackgroundColor: backgroundColor
      }]
    }
  }

  ngOnDestroy(): void{
    if(this.changeHappendSubscription != undefined){
      this.changeHappendSubscription.unsubscribe();
    }  
  }
}
