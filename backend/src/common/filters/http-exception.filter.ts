import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse: any = exception.getResponse();

        let message = 'An error occurred';
        let errors: string[] = [];

        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            if (Array.isArray(exceptionResponse.message)) {
                message = 'Validation failed';
                errors = exceptionResponse.message;
            } else {
                message = exceptionResponse.message || exceptionResponse.error || message;
                errors = [message];
            }
        } else if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
            errors = [message];
        }

        response.status(status).json({
            statusCode: status,
            message,
            errors,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
