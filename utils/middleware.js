const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body) 
    logger.info('Time:  ', new Date()) 
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

let errorCodes = {
    "0B000": "invalid_transaction_initiation",
    "20000": "case_not_found",
    "22000": "data_exception",
    "22002": "null_value_no_indicator_parameter",
    "22003": "numeric_value_out_of_range",
    "22004": "null_value_not_allowed",
    "22026": "string_data_length_mismatch",
    "2202E": "array_subscript_error",
    "2200F": "zero_length_character_string",
    "22P01": "floating_point_exception",
    "22P02": "invalid_text_representation",
    "22P05": "untranslatable_character",
    "22030": "duplicate_json_object_key_value",
    "23000": "integrity_constraint_violation",
    "23001": "restrict_violation",
    "23502": "not_null_violation",
    "23503": "foreign_key_violation",
    "23505": "unique_violation",
    "25000": "invalid_transaction_state",
    "25001": "active_sql_transaction",
    "25002": "branch_transaction_already_active",
    "25P01": "no_active_sql_transaction",
    "25P02": "in_failed_sql_transaction",
    "25P03": "idle_in_transaction_session_timeout",
    "26000": "invalid_sql_statement_name",
    "28000": "invalid_authorization_specification",
    "28P01": "invalid_password",
    "2D000": "invalid_transaction_termination",
    "2F000": "sql_routine_exception",
    "2F005": "function_executed_no_return_statement",
    "2F002": "modifying_sql_data_not_permitted",
    "2F003": "prohibited_sql_statement_attempted",
    "2F004": "reading_sql_data_not_permitted",
    "38001": "containing_sql_not_permitted",
    "38002": "modifying_sql_data_not_permitted",
    "38003": "prohibited_sql_statement_attempted",
    "38004": "reading_sql_data_not_permitted",
    "40000": "transaction_rollback",
    "40002": "transaction_integrity_constraint_violation",
    "42000": "syntax_error_or_access_rule_violation",
    "42601": "syntax_error",
    "42501": "insufficient_privilege",
    "42830": "invalid_foreign_key",
    "42602": "invalid_name",
    "42622": "name_too_long",
    "42939": "reserved_name",
    "42804": "datatype_mismatch",
    "42703": "undefined_column",
    "42P01": "undefined_table",
    "42702": "ambiguous_column",
    "42P09": "ambiguous_alias",
    "42P10": "invalid_column_reference",
    "42611": "invalid_column_definition",
    "42P12": "invalid_database_definition",
    "42P14": "invalid_prepared_statement_definition",
    "42P16": "invalid_table_definition",
    "53300": "too_many_connections",
    "53400": "configuration_limit_exceeded",
    "54001": "statement_too_complex",
    "57000": "operator_intervention",
    "57014": "query_canceled",
    "57P01": "admin_shutdown",
    "57P02": "crash_shutdown",
    "57P03": "cannot_connect_now",
    "57P04": "database_dropped",
    "P0000": "plpgsql_error",
    "08000": "connection_exception",
    "08003": "connection_does_not_exist",
    "08006": "connection_failure",
    "08007": "transaction_resolution_unknown",
    "P0001": "raise_exception",
    "P0002": "no_data_found",
    "XX000": "internal_error",
    "XX001": "data_corrupted"
};

const parseDatabaseError = (error) => {
    return {
        severity: error.severity,
        code: error.code,
        name: errorCodes[error.code],
        message: error.message || error.detail || 'error details not defined'
    }
}

const errorHandler = (error, request, response, next) => {

    logger.error(error)
    if (error.name === 'CastError') {
        return response.status(400).json(error)
    } else if (error.name === 'ValidationError') {
        return response.status(400).json(error)
    }
    else if (errorCodes[error.code] !== undefined) {
        return response.status(400).json({ name: 'Database Error!', details: parseDatabaseError(error) })
    }
    else if (error) {
        return response.status(500).json({ name: 'Unknown error name', error })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}