class ProductNotFoundException(Exception):

    def __init__(self):
        self.message = "Product not found."


class DuplicateSKUException(Exception):

    def __init__(self):
        self.message = "SKU already exists."


class DatabaseException(Exception):

    def __init__(self):
        self.message = "Database error occurred."