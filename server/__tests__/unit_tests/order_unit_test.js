const orderController = require('../../controllers/orderController');
const Order = require('../../models/order');
const ObjectId = require('mongoose').Types.ObjectId;

describe('customerController', function () {
    const res = {
        json: jest.fn(),
        status: function (s) { this.statusCode = s; return this; }
    }

    //  properties needed for request to test
    //  openForBusiness
    const req = {
        params: { orderId: "61669663d11bdfa9fe7588e8" },
        body: { status: "completed" }
    };

    beforeAll(() => {
        // clear the render method (also read about mockReset)
        res.json.mockClear();
        // mock the Mongoose updateOne method
        Order.updateOne = jest.fn().mockResolvedValue([
            {
                _id: "61669663d11bdfa9fe7588e8",
                status: "completed"

            }
        ]);

        Order.findOne = jest.fn().mockResolvedValue(
            {
                _id: "61669663d11bdfa9fe7588e8"

            }
        );

        // mock lean() method
        Order.updateOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(
                {
                    _id: "61669663d11bdfa9fe7588e8",
                    status: "completed"
                }),

        }));

        Order.findOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(
                {
                    _id: "61669663d11bdfa9fe7588e8"
                }),

        }));

        // call the controller function before testing various properties of
        // it
        orderController.updateOrderStatus(req, res);
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterAll(() => {
        // Restore mock after all tests are done, so it won't affect other test suites
        console.log.mockRestore();
    });
    afterEach(() => {
        // Clear mock (all calls etc) after each test. 
        console.log.mockClear();
    });

    // Test 1: test the console
    test("Test 1: test console log, expecting to be order is updated successfully", () => {
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).toHaveBeenLastCalledWith('Update order successfully')
    });

    test("Test 2: testing the order update successfully, expecting return json object ", () => {
        // when I run the controller, I expect that the json method will
        // be called exactly once        
        expect(res.json.mock.calls.length).toEqual(1);
        expect(res.statusCode).toBe(200);

    });
})