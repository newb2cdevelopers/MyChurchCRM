export const getAsyncResult = async (asyncFunction) => {
    try {
        const result = await asyncFunction;

        if(result && !result.ok){
            return [null, `Status code ${result.status}`]
        }

        try{
            var jsonData = await result.json();
            return [jsonData, null]
        }catch (err){
            return [null, err]
        }
    
    }catch(error){
        return [null, error]
    }
}