import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const SurveyNavButtons = () => {
    return (
        <React.Fragment>
            <Stack spacing={16} direction="row" container alignItems="center" justifyContent="center">
                <Button variant="outlined">Back</Button>
                <Button variant="contained">Next</Button>
            </Stack>
        </React.Fragment>
    )
}

export default SurveyNavButtons;