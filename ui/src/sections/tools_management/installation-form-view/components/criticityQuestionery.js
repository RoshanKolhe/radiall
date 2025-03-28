import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Grid, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function CriticityQuestionerySection({ formQuestionery, control, verificationForm }) {
    const booleanOptions = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
    ];

    const isDesktop = useResponsive('up', 'md');

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
                                field.onChange(newValue);
                            }
                            }}
                            sx={{
                            pointerEvents : verificationForm ? 'none' : 'auto',
                            display: "flex",
                            justifyContent: "flex-end",
                            width: isDesktop ? "40%" : '100%',
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
                                pointerEvents : verificationForm ? 'none' : 'auto',
                                flex: 1,
                                backgroundColor: "white",
                                padding: '6px',
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
                    <Grid item xs={6} md={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Controller
                            name={question?.question}
                            control={control}
                            render={({ field }) => (
                            <ToggleButtonGroup
                                {...field}
                                value={field.value ?? "Non Critical"}
                                exclusive
                                onChange={(e, newValue) => {
                                if (newValue !== null) {
                                    field.onChange(newValue);
                                }
                                }}
                                sx={{
                                pointerEvents : 'none',
                                display: "flex",
                                justifyContent: "flex-end",
                                width: isDesktop ? "60%" : '100%',
                                maxWidth: 250,
                                padding: "0px !important",
                                border: "2px solid #00BBD9",
                                borderRadius: "8px",
                                }}
                            >
                                {question?.options?.length && question?.options?.map((opt) => (
                                <ToggleButton
                                    key={opt.toString()}
                                    value={opt}
                                    sx={{
                                    flex: 1,
                                    pointerEvents : 'none',
                                    backgroundColor: "white",
                                    padding: '6px',
                                    borderRadius: "0px !important",
                                    border: "1px solid #00BBD9",
                                    margin: "0px !important",
                                    color: "#00BBD9",
                                    transition: "background-color 0.3s ease",
                                    "&.Mui-selected": {
                                        backgroundColor: "#00BBD9",
                                        color: "#fff",
                                    },
                                    }}
                                >
                                    {opt}
                                </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                            )}
                        />
                    </Grid>
                </Grid>
            );
        }

        if (question.type === 'text') {
            return (
                <Grid container spacing={1} key={question?.question}>
                    <Grid item xs={12} md={12}>
                        <RHFTextField disabled={!!verificationForm} name={question?.question} label={question?.question} defaultValue={question?.answer ?? ''} multiline minRows={3}/>
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

CriticityQuestionerySection.propTypes = {
    formQuestionery: PropTypes.array,
    control: PropTypes.object,
    verificationForm: PropTypes.bool,
};
