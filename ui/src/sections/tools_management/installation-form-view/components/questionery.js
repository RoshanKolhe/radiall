import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Grid, MenuItem, Stack, Tab, Tabs, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function QuestionerySection({ formQuestionery, control, verificationForm }) {
    const [yupValidations, setYupValidations] = useState(null);
    const booleanOptions = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
    ];

    function generateValidationSchema() {
        const validationObject = {};    
        formQuestionery?.forEach((field) => {
            const fieldKey = field?.question;
            if (!fieldKey) return;
    
            if (field.type === 'select') {
                validationObject[fieldKey] = Yup.string().required(`${field?.question} is required`);
            } else if (field.type === 'text') {
                validationObject[fieldKey] = Yup.string();
            } else if (field.type === 'boolean') {
                validationObject[fieldKey] = Yup.boolean();
            }
        });
    
        setYupValidations(Yup.object().shape(validationObject));
    }

    useEffect(() => {
        if (formQuestionery?.length > 0) {
            generateValidationSchema();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formQuestionery]);

    const methods = useForm({
        resolver: yupValidations ? yupResolver(yupValidations) : undefined,
        mode: 'onChange',
        defaultValues: {} 
    });


    const { watch, formState: { errors } } = methods;

    const values = watch();
    const questionFields = (question) => {
        if (question?.type === 'boolean') {
            return (
                <Grid container spacing={1} key={question?.question}>
                    <Grid item xs={6} md={8}>
                        <Typography variant='body1'>{question?.question}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Controller
                        name={question?.question}
                        control={control}
                        render={({ field }) => (
                        <ToggleButtonGroup
                            {...field}
                            value={typeof field.value === "boolean" ? field.value : booleanOptions[0]?.value}
                            exclusive
                            onChange={(e, newValue) => {
                            if (newValue !== null) {
                                console.log("Selected value:", newValue);
                                field.onChange(newValue);
                            }
                            }}
                            sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                            maxWidth: 200,
                            padding: "0px !important",
                            border: "2px solid #00BBD9",
                            borderRadius: "8px",
                            }}
                        >
                            {booleanOptions?.map((opt) => (
                            <ToggleButton
                                key={opt.value.toString()}
                                value={opt.value}
                                sx={{
                                flex: 1,
                                backgroundColor: "white",
                                borderRadius: "0px !important",
                                border: "1px solid #00BBD9",
                                margin: "0px !important",
                                color: "#00BBD9",
                                transition: "background-color 0.3s ease",
                                "&.Mui-selected": {
                                    backgroundColor: "#00BBD9",
                                    color: "#fff",
                                },
                                "&:hover": {
                                    backgroundColor: "#00BBD9",
                                    color: "#fff",
                                },
                                }}
                            >
                                {opt.label}
                            </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                        )}
                    />
                    </Grid>
                </Grid>
            );
        }

        if (question.type === 'select') {
            return (
                <Grid container spacing={1} key={question.question}>
                    <Grid item xs={6} md={8}>
                        <Typography variant='body1'>{question?.question}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <RHFSelect disabled={!!verificationForm} name={question?.question} label='Select' defaultValue={question?.answer}>
                            {question?.options?.length ? question?.options?.map((opt) => (
                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                            )) : (
                                <MenuItem value='' disabled>No Options Found</MenuItem>
                            )}
                        </RHFSelect>
                    </Grid>
                </Grid>
            );
        }

        if (question.type === 'text') {
            return (
                <Grid container spacing={1} key={question?.question}>
                    <Grid item xs={12} md={12}>
                        <RHFTextField disabled={!!verificationForm} name={question?.question} label={question?.question} multiline minRows={3}/>
                    </Grid>
                </Grid>
            );
        }

        return null;
    };

    return (
        <Stack sx={{mt: 2}} spacing={1} direction='column'>
            {formQuestionery?.length > 0 && formQuestionery.map((question) => questionFields(question))}
        </Stack>
    );
}

QuestionerySection.propTypes = {
    formQuestionery: PropTypes.array,
    control: PropTypes.object,
    verificationForm: PropTypes.bool
};
