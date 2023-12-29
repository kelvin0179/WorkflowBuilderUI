import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState } from 'react'
import AnimatedButton from './LoadingButton';
import axios from 'axios';


const ChosenWorkflow = () => {
    const apiArr=["/input","/execution","/result"];
    const [stateArr,setStateArr] = useState(() => Array.from({length: apiArr.length},()=>false));
    const [formData, setFormData] = useState({
        cost: '',
        time:'',
        weight: ''
      });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const costField = ()=>{
    
        return(
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  id="cost"
                  label='Cost'
                  name="cost"
                  variant='outlined'
                  value={formData.cost}
                  onChange={handleInputChange}
                  sx={{marginTop:'1rem'}}
                />
              </FormControl>
            </Grid>
        );
    }
    const handleSubmit = async () => {
        try{
            await axios.get("http://localhost:8080/",formData,{
                headers:{
                    'Content-Type':'application/json'
                },
            }).then((response) => {console.log(response);});
            
        }
        catch(err){
            console.log(err);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} justifyContent="left" alignItems="left" marginLeft={2}>
                    {costField()}
                    <Grid item xs={1} marginTop={3}>
                        <AnimatedButton handleSubmit={handleSubmit}/>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default ChosenWorkflow