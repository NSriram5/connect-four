describe('Connect Four tests',()=>{
    beforeEach(()=>{
        //game initialization code here
    })
    
    
    it("returns a boolean if a win is discovered with the player specified",()=>{
        //feed some test game states to the 
    })

    it("makes a board of width 7 and height 6",()=>{
        WIDTH = 7;
        HEIGHT = 6;
        makeBoard();
        expect(board.length()).toEqual(WIDTH);
        expect(board[0].length()).toEqual(HEIGHT);
    })
    it ("makes a board of width 0 and height 0",()=>{
        WIDTH = 0;
        HEIGHT = 0;
        makeBoard();
        expect(board.length()).toEqual(WIDTH);
        expect(board[0].length()).toEqual(HEIGHT);
    })
    it ("makes a board of width -1 and height 0. Will revert to width of 0",()=>{
        WIDTH = -1;
        HEIGHT = 6;
        makeBoard();
        expect(board.length()).toEqual(WIDTH);
        expect(board[0].length()).toEqual(HEIGHT);
    })

    afterEach(()=>{
        //teardown commands
    })
})