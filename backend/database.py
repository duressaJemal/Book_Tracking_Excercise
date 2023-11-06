# import sqlite3

# def get_db():
#     conn = sqlite3.connect('books.db')
#     cursor = conn.cursor()
#     return conn, cursor

# def create_books_table():
#     conn, cursor = get_db()
#     cursor.execute('''
#         CREATE TABLE IF NOT EXISTS books (
#             id INTEGER PRIMARY KEY,
#             title TEXT,
#             status TEXT
#         )
#     ''')
#     conn.commit()

# def close_db():
#     conn, cursor = get_db()
#     conn.close()

import sqlite3

# Function to get a database connection and cursor
def get_db():
    conn = sqlite3.connect('books.db')
    cursor = conn.cursor()
    return conn, cursor

# Function to create the 'books' table if it doesn't exist
def create_books_table():
    conn, cursor = get_db()
    
    # SQL statement to create the 'books' table with columns: id, title, and status
    create_table_sql = '''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY,
            title TEXT,
            status TEXT
        )
    '''
    
    # Execute the SQL statement to create the table
    cursor.execute(create_table_sql)
    
    # Commit the changes to the database
    conn.commit()

# Function to close the database connection
def close_db():
    conn, cursor = get_db()
    
    # Close the database connection
    conn.close()