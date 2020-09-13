describe('Board making tests',()=>{
    beforeEach(()=>{
        //game initialization code here
    })

    it("makes a board of width 7 and height 6",()=>{
        WIDTH = 7;
        HEIGHT = 6;
        makeBoard();
        expect(board.length).toEqual(WIDTH);
        expect(board[0].length).toEqual(HEIGHT);
    })
    it ("makes a board of width 0 and height 0",()=>{
        WIDTH = 0;
        HEIGHT = 0;
        makeBoard();
        expect(board.length).toEqual(WIDTH);
        expect(board[0].length).toEqual(HEIGHT);
    })
    it ("makes a board of width -1 and height 0. Will revert to width of 0",()=>{
        WIDTH = 1;
        HEIGHT = 6;
        makeBoard();
        expect(board.length).toEqual(WIDTH);
        expect(board[0].length).toEqual(HEIGHT);
    })

    afterEach(()=>{
        reset();
    })
})
describe('Win condition testing',()=>{
    beforeEach(()=>{
        WIDTH = 4;
        HEIGHT = 4;
    })
    it("returns true that there's a win for someone. Horizontal test",()=>{ 
        let testboard = [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]];
        expect(checkForWin(1,testboard)).toEqual(true);
    })
    it("returns true that there's a win for someone. Vertical test",()=>{
        let testboard = [[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        expect(checkForWin(1,testboard)).toEqual(true);
    })
    it("returns true that there's a win for someone. DownRight Diagonal test",()=>{
        let testboard = [[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0]];
        expect(checkForWin(1,testboard)).toEqual(true);
    })
    it("returns true that there's a win for someone. UpwardRight Diagonal test",()=>{
        let testboard = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
        expect(checkForWin(1,testboard)).toEqual(true);
    })
    it("returns true that there's a win for someone. Far right vertical test",()=>{
        let testboard = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]]
        expect(checkForWin(1,testboard)).toEqual(true);
    })

    afterEach(()=>{
        reset();
    })
})
describe("forward play analysis test, builds object of possible futures",()=>{
    beforeEach(()=>{
        
    })
    it("returns an array of objects two of the objects have a win property = true",()=>{
        let testboard = [
            ['E','E','E','E','E','E'],
            [1,'E','E','E','E','E'],
            [1,'E','E','E','E','E'],
            [1,1,1,'E','E','E'],
            [2,2,2,'E','E','E'],
            [2,'E','E','E','E','E'],
            [2,'E','E','E','E','E'],
        ];
        let a = buildOutcomesObject(1,testboard,2);
        console.log(a);
        let b = reviewOutcomesObject(a);
        console.log(b);
        debugger;
    })
})