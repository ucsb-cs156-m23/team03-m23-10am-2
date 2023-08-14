import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrgFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Shorthand Title", "Full Title", "Inactive?"];
    const testId = "UCSBOrganizationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm initialContents={ucsbOrgFixtures.oneOrg} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
        expect(screen.getByText(`OrganizationCode`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm/>
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("just as planned- maxlength", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Shorthand Title is required/);
        expect(screen.getByText(/Full Title is required/)).toBeInTheDocument();
        //expect(screen.getByText(/Inactive status is required/)).toBeInTheDocument();

        const orgCodeInput = screen.getByTestId(`${testId}-orgTranslationShort`);
        fireEvent.change(orgCodeInput, { target: { value: "a".repeat(56) } });
        fireEvent.click(submitButton);


        await waitFor(() => {
            expect(screen.getByText(/Max length 55 characters/)).toBeInTheDocument();
        });
    });

    test("just as planned: renders all correct input", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const tshortInput = screen.getByTestId(`${testId}-orgTranslationShort`);
        const tfullInput = screen.getByTestId(`${testId}-orgTranslation`);
        const inactiveInput = screen.getByTestId(`${testId}-inactive`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(tshortInput, { target: { value: "UCSBSSBU"} });
        fireEvent.change(tfullInput, { target: { value: "Super Smash Brothers Ultimate at UCSB" } });
        fireEvent.change(inactiveInput, { target: { value: true } });
        
        fireEvent.click(submitButton);

        expect(screen.queryByText(/Shorthand Title is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Full Title is required/)).not.toBeInTheDocument();
        //expect(screen.queryByText(/Inactive status is required/)).not.toBeInTheDocument();

    });

    test("just as planned: select Inactive status", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm/>
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        const inactiveInput = screen.getByLabelText("Inactive?");
        expect(inactiveInput).toHaveValue("true");
    
        fireEvent.change(inactiveInput, { target: { value: "false" } });
        
        fireEvent.click(submitButton);
        expect(inactiveInput).toHaveValue("false");
    
        fireEvent.change(inactiveInput, { target: { value: "true" } });
    
       // fireEvent.click(submitButton);
       // expect(inactiveInput.value).toBe("true");    
      });

});