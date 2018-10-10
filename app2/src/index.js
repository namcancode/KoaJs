

import {port} from './untils/config'
import app from './app'


app.listen(port,()=>{
    console.log(`sever is running port: ${port}`);
})