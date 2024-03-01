import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component"
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BookService } from "../../services/book.service";
import { Book } from "src/app/models/book.model";
import { of } from "rxjs";

const listBook: Book[]= [
    {
        name: '',
        author: '',
        isbn: '',
        price:15,
        amount:2
    },
    {
        name: '',
        author: '',
        isbn: '',
        price:20,
        amount:1
    },
    {
        name: '',
        author: '',
        isbn: '',
        price:8,
        amount:7
    }
]

const bookServiceMock = { // de esta manera se mockea todo el servicio y se evita tener que estar creando tanto spyOn
    getBooks: () => of(listBook)
} //sirve mas que todo para servicios con muchos metodos
// fdescribe(' ejecuta solo este describe e ignora a los demas',()=>{});

@Pipe({name:'reduceText'}) //Si se añade un pipe al componente hay que añadirlo tambien aca
class ReducePipeMock implements PipeTransform{
    transform() : string{
        return ''
    }
}

xdescribe(' se salta todo un describe util para cuando necesite que temporalmente se salte ciertos test que no necesito en el momento',()=>{});

describe('home component', () => {
    let component:HomeComponent;
    let fixture:ComponentFixture<HomeComponent>;

    beforeEach( () => {
        TestBed.configureTestingModule({
            imports:[
                HttpClientTestingModule
            ],
            declarations:[
                HomeComponent,
                ReducePipeMock
            ],
            providers:[
                // BookService
                {
                    provide: BookService,
                    useValue: bookServiceMock
                }
            ],
            schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
        }).compileComponents();
    })

    beforeEach( () => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })

    beforeAll( ()=> {
       //solo se llama una vez al inicio de todo 
    });

    afterEach( ()=> {
        //se llama despues de cada test
     });

     afterAll( ()=> {
        //se llama una vez despues de todos los test 
     });

    it('should create', () =>{
        expect(component).toBeTruthy();
    })

    xit('al ponerle una x al inicio a un it se anula y se salta cierto test',()=>{});
    

    // fit('esto hace que de todo el describe solo se ejecute este, muy util para cuando creamos nuevos test probar uno solo',()=>{});
    // es lo mismo que it.only

    it('getBooks get books from the subscrition', () => {
        const bookService = fixture.debugElement.injector.get(BookService);
        // const spy1= jest.spyOn(bookService,'getBooks').mockReturnValueOnce( of(listBook) ); //esto se usa para devolver un valor especifico, usamos of para devolver un observable
        component.getBooks();
        // expect(spy1).toHaveBeenCalledTimes(1);
        expect(component.listBook).toEqual(listBook);//con toEqual compramos objetos y con toBe valores primitivos
        expect(component.listBook.length).toBe(3);
    })
})