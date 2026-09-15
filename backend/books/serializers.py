from rest_framework import serializers
from .models import Book, BookImage

class BookImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookImage
        fields = ["id", "image"]

class BooksSerializer(serializers.ModelSerializer):
    images = BookImageSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = "__all__"

    def to_internal_value(self, data):
        # Handle empty strings for nullable fields so DRF doesn't reject them
        if hasattr(data, 'copy'):
            data = data.copy()
        elif isinstance(data, dict):
            data = dict(data)

        nullable_fields = [
            'edition', 'published_year', 'borrowed_on', 'buyed_on',
            'borrowed_by', 'publisher', 'description', 'book_notes'
        ]
        for field in nullable_fields:
            if field in data and (data[field] == '' or data[field] is None):
                data[field] = None

        return super().to_internal_value(data)