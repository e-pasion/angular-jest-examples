import { CartComponent } from "./cart.component";
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule} from '@angular/common/http/testing'
import { BookService } from "../../services/book.service";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Book } from "src/app/models/book.model";



describe('Cart component',()=>{
    let component: CartComponent;//componente para los test
    let fixture: ComponentFixture<CartComponent>; //variable para extraer de nuestro componente cosas como el servicio
    let bookService:BookService;
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

    beforeEach( () => {// se ejecuta antes de cada test
        TestBed.configureTestingModule({    // TestBed fichero con toda la configuración del test

            imports: [// aca van los modulos
                HttpClientTestingModule,   //simula peticiones reales

            ],
            declarations:[// aca van los componentes
                CartComponent
            ],
            providers:[//servicios que usa nuestro cartComponent y aca van los servicios
                BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();//para que se compilen
    });

    beforeEach( ()=>{//instanciar componente
        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;//instanciamos nuestro componente
        bookService= fixture.debugElement.injector.get(BookService);
        fixture.detectChanges(); //component entra por el ngOnInit
        jest.spyOn(bookService,'getBooksFromCart').mockImplementation(()=> listBook );
    });

    afterEach( ()=>{// se ejecuta despues de cada test
        fixture.destroy(); // destruye el fixture despues de cada test
        jest.resetAllMocks(); //resetea los mocks despues de cada test
    });


    it('should create', ()=>{
        expect(component).toBeTruthy(); //se ha instanciado correctamente
    })

    it('getTotalPrice returns an amount positive',()=>{
        const totalPrice = component.getTotalPrice(listBook);
        expect(totalPrice).toBeGreaterThan(0);
        expect(totalPrice).not.toBe(0);
        expect(totalPrice).not.toBeNull();
    })
    
    it('onInputNumberChange increments correctly', ()=>{
        const action = 'plus';
        const book:Book= {
                name: '',
                author: '',
                isbn: '',
                price:15,
                amount:2
        };
        //metodos para acceder al service
        //const service = (component as any)._bookService; no recomendable ya que rompe con las ventajas de typescript de ser tipado
        //const service = component["_bookService"]; no es recomendable ya que no nos avisa los fallos
        // const service = fixture.debugElement.injector.get(BookService); // esta es la recomendable se hace aca si solo se usa en este metodo sino se hace arriba

        const spy1 = jest.spyOn(bookService,'updateAmountBook').mockImplementation( ()=> null ); //se usa spy para espiar que si se llame el metodo
        const spy2 = jest.spyOn(component, "getTotalPrice").mockImplementation( () => null );  // se usa mockImplementation para que no ejecute el metodo sino el que uno ponga dentro del mockImplementation
        expect(book.amount).toBe(2);
        component.onInputNumberChange(action, book);
        expect(book.amount).toBe(3);
        expect(spy1).toHaveBeenCalled(); // para probar que el spy si fue llamado recomendado para cuando no se sabe cuantas veces se va a llamar
        expect(spy2).toHaveBeenCalledTimes(1); //para probar que fue llamado y valide que fue una sola vez
    })

    it('onInputNumberChange decrements correctly', () => {
        const action = 'minus';
        const actualAmount= listBook[0].amount;
        const spy1= jest.spyOn(bookService,'updateAmountBook').mockImplementation( ()=>null );
        const spy2= jest.spyOn(component,'getTotalPrice').mockImplementation( ()=> null );

        component.onInputNumberChange(action,listBook[0]);

        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
        expect(listBook[0].amount).toBe(actualAmount-1);
    })
    //forma correcta de probar un metodo privado, cuando un metodo es privado se prueba desde su metodo publico
    it('onClearBooks works correctly',() => {
        const spy1= jest.spyOn(bookService,'removeBooksFromCart').mockImplementation( ()=>null );
        const spy2= jest.spyOn(component as any,"_clearListCartBook"); //espiar metodo privado, asi toca cuando es privado y esta en el mismo componente
        component.listCartBook= listBook;
        component.onClearBooks();
        expect(component.listCartBook.length).toBe(0);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
    });

    it('onClearBooks when listCartBooks is 0', ()=>{
        const consoleSpy = jest.spyOn(console,'log');
        component.listCartBook=[];

        component.onClearBooks();

        expect(consoleSpy).toHaveBeenCalledWith('No books available');
    } )

    //forma incorrecta de hacer una prueba a un metodo privado
    it('_clearListCartBook works correctly', ()=> {
        const spy1= jest.spyOn(bookService,'removeBooksFromCart').mockImplementation( ()=>null );
        component.listCartBook= listBook;
        component["_clearListCartBook"]();

        expect(spy1).toHaveBeenCalledTimes(1);
        expect(component.listCartBook.length).toBe(0);
    });

});