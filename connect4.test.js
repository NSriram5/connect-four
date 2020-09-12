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
        WIDTH = 7;
        HEIGHT = 6;
    })
})
describe('Win condition testing',()=>{
    beforeEach(()=>{
        //
    })
    it("returns true that there's a win for someone. Horizontal test",()=>{
        let testboard = [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]];
        console.log(checkForWin(1,testboard));
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
    it("returns true that there's a win for someon. UpwardRight Diagonal test",()=>{
        let testboard = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
        expect(checkForWin(1,testboard)).toEqual(true);
    })
})