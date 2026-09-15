from .views import list_books, add_book, retrieve_book, update_book, delete_book,add_book_images,delete_book_image,add_book_notes,delete_book_notes
from django.urls import path

urlpatterns = [
    path('books/add/', add_book, name='add_book'),
    path('books/', list_books, name='list_books'),
   
    path('books/<int:pk>/', retrieve_book, name='retrieve_book'),
    path('books/<int:pk>/update/', update_book, name='update_book'),
    path('books/<int:pk>/delete/', delete_book, name='delete_book'),
    path('books/<int:pk>/images/', add_book_images, name='add_book_images'),
    path('books/images/<int:image_id>/delete/',delete_book_image,name='delete_book_image'),
    path("books/<int:pk>/notes/", add_book_notes, name="add_book_notes"),

    path("books/<int:pk>/notes/delete/",delete_book_notes, name="delete_book_notes"),

]