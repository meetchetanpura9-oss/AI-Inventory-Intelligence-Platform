class ProductNotFoundException(Exception):

    def __init__(self):
        self.message = "Product not found."


class DuplicateSKUException(Exception):

    def __init__(self):
        self.message = "SKU already exists."


class DatabaseException(Exception):

    def __init__(self):
        self.message = "Database error occurred."


class InsufficientStockException(Exception):

    def __init__(self):
        self.message = "Insufficient stock"


class DuplicateUsernameException(Exception):

    def __init__(self):
        self.message = "Username already exists."


class DuplicateEmailException(Exception):

    def __init__(self):
        self.message = "Email already exists."


class InvalidCredentialsException(Exception):

    def __init__(self):
        self.message = "Incorrect username or password."


class DuplicatePhoneException(Exception):

    def __init__(self):
        self.message = "Phone number already exists."

