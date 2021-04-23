import {handleSubmit} from './../handleSubmit';

describe("Handling submit", () => {
    it("On form submitting", ()=> {
        expect(handleSubmit()).toEqual(undefined);
    })
})