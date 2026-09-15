from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import HttpResponse, response
from .serializers import BooksSerializer
from rest_framework import status
from . models import Book, BookImage
from django.db.models import Q


@api_view(["post"])
@permission_classes([IsAuthenticated])
def add_book(request):
    serializer = BooksSerializer(data=request.data)

    if serializer.is_valid():
        book = serializer.save()
        images = request.FILES.getlist("images")
        for image in images:
            BookImage.objects.create(
                book=book,
                image=image
            )

        serializer = BooksSerializer(book)

        return Response(
            {
                "message": "Book added successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    return Response(
        {
            "message": "Failed to add book",
            "errors": serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )   


@api_view(["get"])
def list_books(request):
    books = Book.objects.all()

    # Search filter across multiple fields
    search = request.GET.get("search") or request.GET.get("q")
    if search:
        search = search.strip()
        books = books.filter(
            Q(name__icontains=search) |
            Q(author__icontains=search) |
            Q(publisher__icontains=search) |
            Q(description__icontains=search) |
            Q(book_type__icontains=search)
        )

    # Category / Book type filter
    book_type = request.GET.get("book_type")
    if book_type and book_type != "ALL":
        books = books.filter(book_type__iexact=book_type)

    # Availability / Status filter
    book_status = request.GET.get("status")
    if book_status == "available":
        books = books.filter(available=True, borrowed=False)
    elif book_status == "borrowed":
        books = books.filter(borrowed=True)
    elif book_status == "unavailable":
        books = books.filter(available=False)

    # Reading status filter
    is_read = request.GET.get("is_read")
    if is_read in ["true", "True", "1"]:
        books = books.filter(is_read=True)
    elif is_read in ["false", "False", "0"]:
        books = books.filter(is_read=False)

    # Favorite filter
    favorite = request.GET.get("favorite")
    if favorite in ["true", "True", "1"]:
        books = books.filter(favorite=True)

    # Ordering / Sorting
    ordering = request.GET.get("ordering")
    valid_orderings = {
        "name": "name",
        "-name": "-name",
        "price": "price",
        "-price": "-price",
        "published_year": "published_year",
        "-published_year": "-published_year",
        "latest": "-id",
        "oldest": "id",
    }
    if ordering in valid_orderings:
        books = books.order_by(valid_orderings[ordering])
    else:
        books = books.order_by("-id")

    serializer = BooksSerializer(books, many=True)

    return Response({
        "message": "Book fetched successfully",
        "data": serializer.data,
        "count": books.count()
    })



@api_view(["get"])
# @permission_classes([IsAuthenticated])
def retrieve_book(request, pk):
    try:
        book = Book.objects.get(pk=pk)
        serializer = BooksSerializer(book)
        return Response({
            "message":"Book fetched successfully",
            "data": serializer.data
            })
    except Book.DoesNotExist:
        return Response({
            "message": "Book not found"
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(["put"])
@permission_classes([IsAuthenticated])
def update_book(request, pk):
    try:
        book = Book.objects.get(pk=pk)
        serializer = BooksSerializer(book, data=request.data,partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Book updated successfully",
                "data": serializer.data
            })
        return Response({
            "message": "Failed to update book",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except Book.DoesNotExist:
        return Response({
            "message": "Book not found"
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(["delete"])
@permission_classes([IsAuthenticated])
def delete_book(request, pk):
    try:
        book = Book.objects.get(pk=pk)
        book.delete()

        return Response({
            "message": "Book deleted successfully"
        })
    except Book.DoesNotExist:
        return Response({
            "message": "Book not found"
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_book_images(request, pk):

    try:
        book = Book.objects.get(pk=pk)

    except Book.DoesNotExist:

        return Response(
            {"message": "Book not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    images = request.FILES.getlist("images")

    if not images:

        return Response(
            {"message": "No images provided"},
            status=status.HTTP_400_BAD_REQUEST
        )

    for image in images:

        BookImage.objects.create(
            book=book,
            image=image
        )

    serializer = BooksSerializer(book)

    return Response({
        "message": "Images added successfully",
        "data": serializer.data
    })



@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_book_image(request, image_id):

    try:
        image = BookImage.objects.get(id=image_id)

    except BookImage.DoesNotExist:

        return Response(
            {"message": "Image not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    image.delete()

    return Response(
        {"message": "Image deleted successfully"},
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_book_notes(request, pk):

    try:
        book = Book.objects.get(pk=pk)

    except Book.DoesNotExist:

        return Response(
            {"message": "Book not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    notes = request.FILES.get("book_notes")

    if not notes:

        return Response(
            {"message": "No notes file provided"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Replace existing notes
    book.book_notes = notes
    book.save()

    serializer = BooksSerializer(book)

    return Response({
        "message": "Notes added successfully",
        "data": serializer.data
    })


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_book_notes(request, pk):

    try:
        book = Book.objects.get(pk=pk)

    except Book.DoesNotExist:

        return Response(
            {"message": "Book not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if book.book_notes:

        book.book_notes.delete(save=False)
        book.book_notes = None
        book.save()

    return Response({
        "message": "Notes deleted successfully"
    })