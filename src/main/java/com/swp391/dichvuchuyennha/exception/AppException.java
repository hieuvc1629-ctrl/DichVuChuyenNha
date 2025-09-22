package com.swp391.dichvuchuyennha.exception;

public class AppException extends RuntimeException {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    public AppException(String message) {
        super(message);
    }
}
=======

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
=======

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
>>>>>>> Stashed changes

    private ErrorCode errorCode;

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
<<<<<<< Updated upstream
}
>>>>>>> Stashed changes
=======
}
>>>>>>> Stashed changes
