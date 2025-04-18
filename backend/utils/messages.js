module.exports = {
    _auth_module: {
        created: (name) => `${name || "Product"} created successfully.`,
        login: (name) => `${name || "Product"} login successfully.`,
        logout: (name) => `${name || "Product"} logout successfully.`,
        allReadyExist: (key) => `${key || "Product"} already exists.`,
        unAuth: "Unauthorized access.",
        tokenMissing: "Token missing, Please login again.",
        tokenExpired: "Token Expired, Please login again."
    },
    _middleware: {
        dbNotInitDB: (name) => `DB not initialized for ${name}.`,
        require: (name) => `${name} is required.`
    },
    _query: {
        add: (key) => `${key || "Product"} added successfully.`,
        get: (key) => `${key || "Product"} fetched successfully.`,
        update: (key) => `${key || "Product"} updated successfully.`,
        notFound: (key) => `${key || "Product"} not found.`,
        invalid: (key) => `Invalid ${key}.`,
        save: (key) => `${key || "Product"} saved successfully.`,
        delete: (key) => `${key || "Product"} deleted successfully.`,
        duplicate: (key) => `${key || "Product"} duplicate found.`,
        missing: (key) => `${key || "Product"} parameters missing.`,
    },
    _onboardMsg: {
        reqSubmit: 'Thank you for submitting your product details, someone from our team will get in touch with you.',
        alreadyExist: 'Product already exists.'
    },

    _response_message: {
        invalid: (key) => `Invalid ${key}.`,
        windowNotAvailable: () => `Currently window not available.`,
        emailSend: () => `Email sent successfully.`,
        alreadyExist: (key) => `${key || "Product"} already exists.`,
        created: (name) => `${name || "Product"} created successfully.`,
        updated: (name) => `${name || "Product"} updated successfully.`,
        notFound: (key) => `${key || "Product"} not found.`,
        exportCsv: (key) => `${key || "Product"} downloaded successfully.`,
        deleted: (name) => `${name || "Product"} deleted successfully.`,
        alreadyDeleted: (key) => `${key || "Product"} already deleted.`,
        found: (key) => `${key || "Product"} found successfully.`,
        mailSent: (key) => `${key || "Product"} sent successfully.`,
        mailNotSent: (key) => `${key || "Product"} not sent.`,
        Unauthorized: (key) => `${key || "User"} Unauthorized`,
        alreadyUpdated: (key, value) => `${key || "Product"} already updated ${value ? "as " + value : ""}`,
        outOfStock: (key) => `${key} Out of Stock.`,
        notAllowed: (key) => `Only ${key} items are allowed by the admin.`
    },
    _query: {
        add: (entity) => `${entity} added successfully.`,
        update: (entity) => `${entity} updated successfully.`,
        delete: (entity) => `${entity} deleted successfully.`,
        fetch: (entity) => `${entity} fetched successfully.`,
      },
      _error: {
        notFound: (entity) => `${entity} not found.`,
        invalidData: (entity) => `Invalid data for ${entity}.`,
        forbidden: (entity) => `You are not authorized to perform this action on ${entity}.`,
      },
      _dispute: {
        add: "Dispute added successfully.",
        resolve: "Dispute resolved successfully.",
        notFound: "Dispute not found.",
        invalidStatus: "Invalid status for dispute resolution.",
      },
      _transaction: {
        success: "Transaction completed successfully.",
        failure: "Transaction failed.",
        update: "Transaction status updated successfully.",
      },
}
