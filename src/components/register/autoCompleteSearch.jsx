import React, {useState, useEffect} from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const AutoCompleteSearch = ({items, setSelectedChurchId, error, helperText}) => {
const [value, setValue] = useState(null);


  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
          setSelectedChurchId(newValue);
          setValue(newValue);
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={items}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      sx={{ width: '100%' }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} error={error} helperText={helperText} label="Seleccione el nombre de la iglesia" />
      )}
    />
  )
}
  export default AutoCompleteSearch;