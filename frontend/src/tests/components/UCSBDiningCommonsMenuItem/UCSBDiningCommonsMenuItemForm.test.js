
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));



describe("UCSBDiningCommonsMenuItemForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Dining Common", "Name", "Station"];
    const testId = "UCSBDiningCommonsMenuItemForm";

    //passes
    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByText(/Dining Common/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in an Item", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm initialContents={ucsbDiningCommonsMenuItemFixtures.oneItem} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );

        //test min length (1 character at least)
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Dining Common is required./);
        expect(screen.getByText(/Name is required./)).toBeInTheDocument();
        expect(screen.getByText(/Station is required./)).toBeInTheDocument();

        
        //test max length
        const nameInput = screen.getByTestId(`${testId}-diningCommonsCode`);
        fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Dining Common Max length 30 characters/)).toBeInTheDocument();
        });
        
        const nameInput2 = screen.getByTestId(`${testId}-name`);
        fireEvent.change(nameInput2, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Name Max length 30 characters/)).toBeInTheDocument();
        });
        
        const nameInput3 = screen.getByTestId(`${testId}-station`);
        fireEvent.change(nameInput3, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Station Max length 30 characters/)).toBeInTheDocument();
        }); 

    });

});
   
    


    /* UCSB DATES COPY BELOW
    test("Correct Error messsages on bad input", async () => {

        render(q
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
        const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.change(diningCommonsCodeField, { target: { value: 'bad-input' } });
        fireEvent.change(nameField, { target: { value: 'bad-input' } });
        fireEvent.change(stationField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        //await screen.findByText(/QuarterYYYYQ must be in the format YYYYQ/);
    });

    
    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBDateForm />
            </Router>
        );
        await screen.findByTestId("UCSBDateForm-submit");
        const submitButton = screen.getByTestId("UCSBDateForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/QuarterYYYYQ is required./);
        expect(screen.getByText(/Name is required./)).toBeInTheDocument();
        expect(screen.getByText(/LocalDateTime is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBDateForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("UCSBDateForm-quarterYYYYQ");

        const quarterYYYYQField = screen.getByTestId("UCSBDateForm-quarterYYYYQ");
        const nameField = screen.getByTestId("UCSBDateForm-name");
        const localDateTimeField = screen.getByTestId("UCSBDateForm-localDateTime");
        const submitButton = screen.getByTestId("UCSBDateForm-submit");

        fireEvent.change(quarterYYYYQField, { target: { value: '20221' } });
        fireEvent.change(nameField, { target: { value: 'noon on January 2nd' } });
        fireEvent.change(localDateTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/)).not.toBeInTheDocument();
        expect(screen.queryByText(/localDateTime must be in ISO format/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBDateForm />
            </Router>
        );
        await screen.findByTestId("UCSBDateForm-cancel");
        const cancelButton = screen.getByTestId("UCSBDateForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

}); */
