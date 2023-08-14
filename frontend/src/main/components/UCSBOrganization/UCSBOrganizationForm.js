import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function UCSBOrganizationForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();

    const testIdPrefix = "UCSBOrganizationForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                    <Form.Label htmlFor="orgCode">OrganizationCode</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-orgCode"}
                        id="orgCode"
                        type="text"
                        isInvalid={Boolean(errors.orgCode)}
                        {...register("orgCode" , {
                            required: "orgCode is required."
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.orgCode?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgTranslationShort">Shorthand Title</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgTranslationShort"}
                    id="orgTranslationShort"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslationShort)}
                    {...register("orgTranslationShort", {
                        required: "Shorthand Title is required.",
                        maxLength : {
                            value: 55,
                            message: "Max length 55 characters"
                        }
                    })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.orgTranslationShort?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>
            </Row>
            
            <Row>
                <Col>
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgTranslation">Full Title</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgTranslation"}
                    id="orgTranslation"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslation)}
                    {...register("orgTranslation", {
                        required: "Full Title is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgTranslation?.message}
                </Form.Control.Feedback>
            </Form.Group>
            </Col>
            </Row>

            <Row>
                <Col>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="inactive">Inactive?</Form.Label>
                <Form.Control
                data-testid={testIdPrefix + "-inactive"}
                id="inactive"
                as="select"
                {...register("inactive", )}
                >
                <option value="true" selected>true</option>
                <option value="false">false</option>
                </Form.Control>
            </Form.Group>
            </Col>
            </Row>
            
            <Row>
                <Col>
            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>
            </Col>
            </Row>
        </Form>

    )
}

export default UCSBOrganizationForm;