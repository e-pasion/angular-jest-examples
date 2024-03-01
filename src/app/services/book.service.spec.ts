import { TestBed } from "@angular/core/testing";
import { BookService } from "./book.service"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Book } from "../models/book.model";
import { environment } from "../../environments/environment.prod";
import swal from 'sweetalert2';

const toastMock = {
    fire: ()=> null
} as any;

const mock = () => {
    let storage: { [key: string]: string } = {};
    return {
        getItem: (key: string) => (key in storage ? storage[key]: null),
        setItem: (key: string, value: string) => (storage[key] = value),
        removeItem: (key: string) => delete storage[key],
        clear: () => (storage = {}),
    };
};
 
Object.defineProperty(window, 'localStorage', { value: mock() });


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

describe('BookService', () => {
    let service: BookService;
    let httpMock: HttpTestingController; //Para evitar uqe se hagan peticiones reales

    beforeEach( ()=>{
        TestBed.configureTestingModule({
            imports:[
                HttpClientTestingModule
            ],providers: [
                BookService
            ],schemas:[
                CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA
            ]
        })
    });

    beforeEach( ()=> {
        service= TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController);
    })

    afterEach( () => {
        httpMock.verify(); //no se lanze el siguiente test mientras alla una peticion pendiente
        jest.clearAllMocks();
        localStorage.clear();
    })

    it('should create', () => {
        expect(service).toBeTruthy();
    })

    it('getBook return a list of books and does a get method', () => {
        service.getBooks().subscribe((resp: Book[])=>{
            expect(resp).toEqual(listBook);
        });

        const req= httpMock.expectOne(environment.API_REST_URL + `/book`)
        expect(req.request.method).toBe('GET');
        req.flush(listBook); //simular que la peticion se ha hecho y que devuelva un observable de listBook
    })

    it('getBooksFromCart returns empty listBook', () => {
        const listBook= service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    })

    it('getBooksFromCart returns a listBook when exists in localstorage', () => {
        localStorage.setItem('listCartBook', JSON.stringify(listBook));
        const listBooks= service.getBooksFromCart();
        expect(listBook.length).toBe(3);
        expect(listBooks).toEqual(listBook);
    })

    it('removeBooksFromCart correctly remove books from localStorage', ()=> {
        const book: Book= {
            id: "3",
            name: '',
            author: '',
            isbn: '',
            price:15
        }

        jest.spyOn(swal,'mixin').mockImplementation( ()=>{
            return toastMock
        });

        service.addBookToCart(book);
        let listBooks= service.getBooksFromCart();
        expect(listBooks.length).toBe(1);
        service.removeBooksFromCart();
        listBooks= service.getBooksFromCart();
        expect(listBooks.length).toBe(0);
    })


    it('addBookToCart when listBook is null', ()=> {
        const book: Book= {
            name: '',
            author: '',
            isbn: '',
            price:15
        }

        const spy1= jest.spyOn(swal,'mixin').mockImplementation( ()=>{
            return toastMock
        });

        let newListBook= service.getBooksFromCart();
        expect(newListBook.length).toBe(0);

        service.addBookToCart(book);
        newListBook = service.getBooksFromCart(); 

        expect(newListBook.length).toBe(1);
        expect(spy1).toHaveBeenCalledTimes(1);
    })

    it('addBookToCart when localStorage returns two books and add different book', () => {
        const book: Book= {
            id: "3",
            name: '',
            author: '',
            isbn: '',
            price:15
        }

        const listBook: Book[]= [
            {
                id: "1",
                name: '',
                author: '',
                isbn: '',
                price:15,
            },
            {
                id: "2",
                name: '',
                author: '',
                isbn: '',
                price:20,
            }
        ]
        
        const spy1= jest.spyOn(swal,'mixin').mockImplementation( ()=>{
            return toastMock
        });

        localStorage.setItem('listCartBook',JSON.stringify(listBook));

        let newListBook= service.getBooksFromCart();
        expect(newListBook.length).toBe(2);

        service.addBookToCart(book);
        newListBook= service.getBooksFromCart();
        expect(newListBook.length).toBe(3);
        expect(spy1).toHaveBeenCalledTimes(1);

    });


    it('addBookToCart when localStorage returns two books and add same book', () => {
        const book: Book= {
            id: "2",
            name: '',
            author: '',
            isbn: '',
            price:20
        }

        const listBook: Book[]= [
            {
                id: "1",
                name: '',
                author: '',
                isbn: '',
                price:15,
            },
            {
                id: "2",
                name: '',
                author: '',
                isbn: '',
                price:20,
            }
        ]
        
        const spy1= jest.spyOn(swal,'mixin').mockImplementation( ()=>{
            return toastMock
        });

        localStorage.setItem('listCartBook',JSON.stringify(listBook));

        let newListBook= service.getBooksFromCart();
        expect(newListBook.length).toBe(2);

        service.addBookToCart(book);
        newListBook= service.getBooksFromCart();
        expect(newListBook.length).toBe(2);
        expect(spy1).toHaveBeenCalledTimes(1);

    });

    it('updateAmounBook when book has amount',() => {
        const book: Book= {
            id: "2",
            name: '',
            author: '',
            isbn: '',
            price:20,
            amount:2
        }

        const listBook: Book[]= [
            {
                id: "1",
                name: '',
                author: '',
                isbn: '',
                price:15,
                amount:1,
            },
            {
                id: "2",
                name: '',
                author: '',
                isbn: '',
                price:20,
                amount:1,
            }
        ]

        localStorage.setItem('listCartBook',JSON.stringify(listBook));

        const listBookCart:Book[]= service.updateAmountBook(book);
        
        const updatedBook:Book= listBookCart.find((item:Book) =>{
            return book.id ===item.id;
        })

        expect(updatedBook.amount).toBe(2);
        
    });

    it('updateAmounBook when new book amount is 0',() => {
        const book: Book= {
            id: "2",
            name: '',
            author: '',
            isbn: '',
            price:20,
            amount:0
        }

        const listBook: Book[]= [
            {
                id: "1",
                name: '',
                author: '',
                isbn: '',
                price:15,
                amount:1,
            },
            {
                id: "2",
                name: '',
                author: '',
                isbn: '',
                price:20,
                amount:1,
            }
        ]

        localStorage.setItem('listCartBook',JSON.stringify(listBook));

        const listBookCart:Book[]= service.updateAmountBook(book);
        
        const updatedBook:Book= listBookCart.find((item:Book) =>{
            return book.id ===item.id;
        })

        expect(updatedBook).toBeUndefined();
        expect(listBookCart.length).toBe(1);
        
    });




})