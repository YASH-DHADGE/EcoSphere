#!/usr/bin/env python
"""
Script to switch database configuration to Supabase PostgreSQL
Run this script when Supabase connection is working
"""

import os
import sys

def switch_to_supabase():
    """Switch database configuration to Supabase"""
    
    dev_settings_path = os.path.join(os.path.dirname(__file__), 'ecosphere', 'settings', 'dev.py')
    
    # Read current settings
    with open(dev_settings_path, 'r') as f:
        content = f.read()
    
    # Replace SQLite configuration with Supabase
    new_content = content.replace(
        '''# Development database configuration
# Use SQLite for local development (Supabase connection issues)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Supabase PostgreSQL configuration (commented out due to connection issues)
# DATABASES = {
#     'default': env.db('DATABASE_URL', default='postgresql://postgres:[61jcOotVpdfQzskR]@db.nnlwpvkbgfnpimgvuwtq.supabase.co:5432/postgres')
# }''',
        '''# Development database configuration
# Using Supabase PostgreSQL
DATABASES = {
    'default': env.db('DATABASE_URL', default='postgresql://postgres:[61jcOotVpdfQzskR]@db.nnlwpvkbgfnpimgvuwtq.supabase.co:5432/postgres')
}

# SQLite fallback (commented out)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }'''
    )
    
    # Write updated settings
    with open(dev_settings_path, 'w') as f:
        f.write(new_content)
    
    print("✅ Switched to Supabase PostgreSQL configuration")
    print("🔄 Please run: python manage.py migrate")
    print("🚀 Then start the server: python manage.py runserver")

def switch_to_sqlite():
    """Switch database configuration back to SQLite"""
    
    dev_settings_path = os.path.join(os.path.dirname(__file__), 'ecosphere', 'settings', 'dev.py')
    
    # Read current settings
    with open(dev_settings_path, 'r') as f:
        content = f.read()
    
    # Replace Supabase configuration with SQLite
    new_content = content.replace(
        '''# Development database configuration
# Using Supabase PostgreSQL
DATABASES = {
    'default': env.db('DATABASE_URL', default='postgresql://postgres:[61jcOotVpdfQzskR]@db.nnlwpvkbgfnpimgvuwtq.supabase.co:5432/postgres')
}

# SQLite fallback (commented out)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }''',
        '''# Development database configuration
# Use SQLite for local development (Supabase connection issues)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Supabase PostgreSQL configuration (commented out due to connection issues)
# DATABASES = {
#     'default': env.db('DATABASE_URL', default='postgresql://postgres:[61jcOotVpdfQzskR]@db.nnlwpvkbgfnpimgvuwtq.supabase.co:5432/postgres')
# }'''
    )
    
    # Write updated settings
    with open(dev_settings_path, 'w') as f:
        f.write(new_content)
    
    print("✅ Switched to SQLite configuration")
    print("🚀 You can now start the server: python manage.py runserver")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "supabase":
        switch_to_supabase()
    elif len(sys.argv) > 1 and sys.argv[1] == "sqlite":
        switch_to_sqlite()
    else:
        print("Usage:")
        print("  python switch_to_supabase.py supabase  # Switch to Supabase")
        print("  python switch_to_supabase.py sqlite    # Switch to SQLite")
