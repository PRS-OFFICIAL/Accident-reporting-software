class ApiError extends Error{
    constructor(
        statusCode,
        message ="Something went wrong",
        error=[],
        statch=""
    ){
        super(message)
        this.statusCode=statusCode;
        this.data =null;
        this.message=message;
        // this.success =success;
        this.error=error
        if(this.statch){
            this.statch=statch
        }else{
             Error.captureStackTrace(this,this.constructor)
        }
    }
}
export{ApiError}