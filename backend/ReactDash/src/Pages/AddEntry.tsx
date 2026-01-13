import TheDrawer from '../Components/drawer'
import { TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Alert from '@mui/material/Alert'


const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)


export default function Page1() {
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        scientificName: '',
        commonName: '',
        leafType: '',
        fruitType: '',
        etymology: '',
        habitat: '',
        identificationCharacteristics: '',
        phenology: '',
        seedGermination: '',
        pests: ''
    })

    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')







    const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: event.target.value
        }))
    }

    const handleSubmit = async () => {

        const requiredFields = [
            { value: formData.scientificName, name: 'Scientific Name' },
            { value: formData.commonName, name: 'Common Name' },
            { value: formData.leafType, name: 'Leaf Type' },
            { value: formData.fruitType, name: 'Fruit Type' }
        ]

        const emptyField = requiredFields.find(field => !field.value)

        if (emptyField) {
            setError(`${emptyField.name} cannot be empty!`)
            return
        }

        setLoading(true)
        setStatus('')
        setError('')

        try {
            const { error } = await supabase
                .from('species_en')
                .insert([
                    { 
                        scientific_name: formData.scientificName,
                        common_name: formData.commonName ,
                        etymology: formData.etymology,
                        habitat: formData.habitat,
                        identification_character: formData.identificationCharacteristics,
                        leaf_type: formData.leafType,
                        fruit_type: formData.fruitType,
                        phenology: formData.phenology,
                        seed_germination: formData.seedGermination,
                        pest: formData.pests 
                    }
                ]).select()

            if (error) {
                console.error('========== SUPABASE ERROR DETAILS ==========')
                console.error('Error object:', error)
                console.error('Error code:', error.code)
                console.error('Error details:', error.details)
                console.error('Error hint:', error.hint)
                console.error('Full error JSON:', JSON.stringify(error, null, 2))
                console.error('===========================================')
                
                let errorMsg = `Error Code: ${error.code}\n`
                errorMsg += `Message: ${error.message}\n`
                if (error.details) errorMsg += `Details: ${error.details}\n`
                if (error.hint) errorMsg += `Hint: ${error.hint}`
                
                throw new Error(errorMsg)
            }

            setStatus('Species added successfully!')
            setError('')

            setFormData({
                scientificName: '',
                commonName: '',
                leafType: '',
                fruitType: '',
                etymology: '',
                habitat: '',
                identificationCharacteristics: '',
                phenology: '',
                seedGermination: '',
                pests: ''
            })


        }


        catch (error) {
            setStatus(`Error: ${(error as Error).message}`)
        }

        finally {
            setLoading(false)
        }

    }





    return (
        <Box sx={{ width: '100%', paddingX: 0 }}>

            <div><TheDrawer></TheDrawer></div>
            <h1>Add Species</h1>
            <Box>   
                <TextField
                    id="TextBox1"
                    label="Scientific Name"
                    helperText="Required"
                    value={formData.scientificName}
                    onChange={handleChange('scientificName')}
                    sx={{
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiFormHelperText-root': { color: 'red' },
                        marginRight: 8
                    }}
                    />

                    <TextField
                    id="TextBox2"
                    label="Common Name"
                    helperText="Required"
                    value={formData.commonName}
                    onChange={handleChange('commonName')}
                    sx={{
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiFormHelperText-root': { color: 'red' }
                    }}
                    />

            
            </Box>

            <Box sx={{marginTop: 2}}>   
                <TextField
                    id="TextBox3"
                    label="Leaf Type"
                    helperText="Required"
                    value={formData.leafType}
                    onChange={handleChange('leafType')}
                    sx={{
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiFormHelperText-root': { color: 'red' },
                        marginRight: 8
                    }}
                    />

                    <TextField
                    id="TextBox4"
                    label="Fruit Type"
                    helperText="Required"
                    value={formData.fruitType}
                    onChange={handleChange('fruitType')}
                    sx={{
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiFormHelperText-root': { color: 'red' }
                    }}
                    />

            
            </Box>

            <div><h5>Optional:</h5></div>

            <Box sx={{ display: 'flex', gap: 1, marginTop: 3, marginBottom: 3, maxWidth: '70%', marginX: 'auto'}}>
                <TextField 
                    fullWidth 
                    label="Etymology" 
                    id="BigText1"
                    multiline
                    rows={4}
                    value={formData.etymology}
                    onChange={handleChange('etymology')}
                    sx={{
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': { color: 'white' },
                    }}
                />

                <TextField 
                    fullWidth 
                    label="Habitat" 
                    id="BigText2"
                    multiline
                    rows={4}
                    value={formData.habitat}
                    onChange={handleChange('habitat')}
                    sx={{
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': { color: 'white' },
                    }}
                />
            </Box>


            <Box sx={{ display: 'flex', gap: 1, marginTop: 3, marginBottom: 3, maxWidth: '70%', marginX: 'auto'}}>
                <TextField fullWidth 
                    label="Identification Characteristics" 
                    id="BigText3"
                    multiline
                    rows={4}
                    value={formData.identificationCharacteristics}
                    onChange={handleChange('identificationCharacteristics')}
                    sx={{
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                    }}
                />

                <TextField fullWidth 
                    label="Phenology" 
                    id="BigText4"
                    multiline
                    rows={4}
                    value={formData.phenology}
                    onChange={handleChange('phenology')}
                    sx={{
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                    }}
                />
            </Box>


            <Box sx={{ display: 'flex', gap: 1, marginTop: 3, marginBottom: 3, maxWidth: '70%', marginX: 'auto'}}>
                <TextField fullWidth 
                    label="Seed Germination" 
                    id="BigText5"
                    multiline
                    rows={4}
                    value={formData.seedGermination}
                    onChange={handleChange('seedGermination')}
                    sx={{
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                    }}
                />

                <TextField fullWidth 
                    label="Pests" 
                    id="BigText6"
                    multiline
                    rows={4}
                    value={formData.pests}
                    onChange={handleChange('pests')}
                    sx={{
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                    }}
                />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2}}>
                
                {status && (
                    <Alert severity="success">
                        {status}
                    </Alert>
                )}



                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

            </Box>



            <Box>
                <Button variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Entry'}
                </Button>
            </Box>

        </Box>
    )
}