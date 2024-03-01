import { ReduceTextPipe } from "./reduce-text.pipe"

describe('ReduceTextPipe', () => {
    let pipe:ReduceTextPipe;

    beforeEach( ()=> {
        pipe= new ReduceTextPipe();
    })

    it('should create', ()=>{
        expect(pipe).toBeTruthy();
    });

    it('use transform correctly', ()=> {
        const size=5;
        const text= 'Hello this is a biiiiiiiiiiiig text to check pipe'
        const newText= pipe.transform(text,size);
        expect(newText.length).toBe(size);
    });
})