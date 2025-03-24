import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Grid, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import CriticityQuestionerySection from './components/criticityQuestionery';

// ---------------------------------------------------------------------------------------------------------------

export default function CriticitySection({ currentForm, verificationForm }) {
    const { enqueueSnackbar } = useSnackbar();
    const [yupValidations, setYupValidations] = useState(null);
    const [questioneryValues, setQuestioneryValues] = useState({});

    function generateValidationSchema() {
        const validationObject = {};    
        currentForm?.criticityQuestionery?.forEach((field) => {
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
        if (currentForm?.criticityQuestionery?.length > 0) {
            generateValidationSchema();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentForm?.criticityQuestionery]);

    useEffect(() => {
        const newValues = currentForm?.criticityQuestionery?.length > 0 ? currentForm?.criticityQuestionery?.map((que) => {
            if(que?.type === 'select'){
                return{
                    [que?.question]: que?.answer !== undefined ? que?.answer :  'Non Critical'
                }
            }

            if (que?.type === 'boolean') {
                return {
                    [que?.question]: (que?.answer !== undefined && que?.anser !== '') ? que?.answer : false
                };
            }

            return{
                [que?.question]: que?.answer !== undefined ? que?.answer : ''
            }
        }) : {};

        setQuestioneryValues(newValues);
    }, [currentForm?.criticityQuestionery])

    const defaultValues = useMemo(() => {
        const structuredQuestioneryValues = Object.entries(questioneryValues || {}).reduce(
            (acc, [_, value]) => ({ ...acc, ...value }),
            {}
        );
    
        return {
            ...structuredQuestioneryValues 
        };
    }, [questioneryValues]);

    const methods = useForm({
    resolver: yupResolver(yupValidations),
    defaultValues,
    });

    const {
    reset,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async(formData) => {
        console.log('final data', formData);
        try {
            const updatedQuestionery = currentForm?.criticityQuestionery?.map((question) => ({
                question: question?.question ?? "", 
                type: question?.type ?? "", 
                options: question?.options ?? [], 
                isFieldChanging: question?.isFieldChanging ?? false, 
                fieldName: question?.fieldName ?? "", 
                answer: formData?.[question?.question] ?? "", 
            }));
    
            const inputData = {
                criticity: updatedQuestionery,
            };
    
            const response = await axiosInstance.patch(`/update-criticity/${currentForm?.id}`, inputData);
    
            if(response?.data?.success){
                enqueueSnackbar(response?.data?.message, {variant : 'success'});
            }else{
                enqueueSnackbar('Update failed', {variant : 'error'});
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
            variant: 'error',
            });
        }
    })

    useEffect(() => {
    if (currentForm?.criticityQuestionery?.length > 0) {
        reset(defaultValues);
    }
    }, [currentForm?.criticityQuestionery, defaultValues, reset]);

    useEffect(() => {
        handleDecision();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    const handleDecision = () => {
        if (currentForm?.criticityQuestionery?.length > 0) {
            const booleanTypeQuestionery = currentForm.criticityQuestionery.filter(que => que?.type === 'boolean');
    
            const isAnyValueTrue = booleanTypeQuestionery.find(que => values[que.question] === true);
    
            if (isAnyValueTrue) {
                setValue('Suggested family', "Critical");
            }else{
                setValue('Suggested family', "Non Critical");
            }
        }
    };
    

    return(
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Card sx={{ p: 3, mt: 2 }}>
                <Grid item xs={12} md={12}>
                    <Box component='div' sx={{width : '100%', py: 2, px: 1, borderBottom: '2px solid lightGray'}}>
                        <Typography variant='h5'>Criticity</Typography>
                    </Box>
                    <CriticityQuestionerySection formQuestionery={currentForm?.criticityQuestionery} control={control} verificationForm={verificationForm}/>
                    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                        {!verificationForm && <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Save
                        </LoadingButton>}
                    </Stack>
                </Grid>
            </Card>
        </FormProvider>
    )
}

CriticitySection.propTypes = {
    currentForm: PropTypes.array,
    verificationForm: PropTypes.bool,
};