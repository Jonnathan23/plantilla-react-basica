import { ErrorCodes } from "@/core/domain/errors/codes-enums.error";
import type { FormattedErrorResponse } from "@/core/domain/errors/format-response.error";

type CustomErrorProps =
    | {
          message: string;
          field?: string;
          code?: string;
          errors?: never;
      }
    | {
          errors: FormattedErrorResponse[];
          message?: never;
          field?: never;
          code?: never;
      };

const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred";

export class CustomError extends Error {
    public readonly statusCode: number;
    public readonly errors: FormattedErrorResponse[];

    private constructor(statusCode: number, errors: FormattedErrorResponse[]) {
        const defaultMessage = errors[0]?.message ?? DEFAULT_ERROR_MESSAGE;

        super(defaultMessage);

        this.name = "CustomError";
        this.statusCode = statusCode;
        this.errors = errors;

        Object.setPrototypeOf(this, new.target.prototype);
    }

    private static buildErrors(props: CustomErrorProps): FormattedErrorResponse[] {
        if (props.errors) {
            return props.errors;
        }

        return [
            {
                message: props.message,
                ...(props.field !== undefined ? { field: props.field } : {}),
                ...(props.code !== undefined ? { code: props.code } : {}),
            },
        ];
    }

    public static badRequest(props: CustomErrorProps): CustomError {
        return new CustomError(ErrorCodes.BAD_REQUEST, CustomError.buildErrors(props));
    }

    public static unauthorized(props: CustomErrorProps): CustomError {
        return new CustomError(ErrorCodes.UNAUTHORIZED, CustomError.buildErrors(props));
    }

    public static forbidden(props: CustomErrorProps): CustomError {
        return new CustomError(ErrorCodes.FORBIDDEN, CustomError.buildErrors(props));
    }

    public static notFound(props: CustomErrorProps): CustomError {
        return new CustomError(ErrorCodes.NOT_FOUND, CustomError.buildErrors(props));
    }

    public static conflict(props: CustomErrorProps): CustomError {
        return new CustomError(ErrorCodes.CONFLICT, CustomError.buildErrors(props));
    }

    public static internalServer(props: CustomErrorProps): CustomError {
        return new CustomError(ErrorCodes.INTERNAL_SERVER, CustomError.buildErrors(props));
    }

    public static serviceUnavailable(props: CustomErrorProps): CustomError {
        return new CustomError(ErrorCodes.SERVICE_UNAVAILABLE, CustomError.buildErrors(props));
    }
}
