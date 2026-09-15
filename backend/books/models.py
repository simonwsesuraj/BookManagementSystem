from django.db import models

class Book(models.Model):

    BOOK_TYPE = [
        ("POLITICS","Politics"),
        ("HISTORY","History"),
        ("FARMING","Farming"),
        ("ECONOMIC","Economic"),
        ("GENERAL","General"),
        ("SCIENCE","Science"),
        ("LITRATURE",'Litrature'),
        ("OTHER","Other"),
    ]
    name = models.CharField(max_length=200,db_index=True,unique=True)

    author = models.CharField(max_length=200,db_index=True)

    publisher = models.CharField(max_length=150,null=True,blank=True)

    edition = models.IntegerField(null=True,blank=True)

    published_year = models.IntegerField(null=True,blank=True)

    book_type = models.CharField(choices=BOOK_TYPE,default="HISTORY",max_length=50)

    available = models.BooleanField(default=True)

    borrowed = models.BooleanField(default=False)

    borrowed_by = models.CharField(max_length=100,null=True,blank=True)

    borrowed_on = models.DateField(null=True,blank=True)

    description = models.TextField(blank=True,null=True)

    book_notes = models.FileField(blank=True,null=True,upload_to="book_notes/")

    favorite = models.BooleanField(default=False)

    is_read = models.BooleanField(default=False)

    buyed_on = models.DateField(null=True,blank=True)

    price = models.DecimalField(decimal_places=2,max_digits=10)



    def __str__(self):
        return f"{self.name} -- {self.author} -- {self.book_type} -- {self.id}"


class BookImage(models.Model):
    book = models.ForeignKey(Book,on_delete=models.CASCADE,related_name="images")

    image = models.ImageField(upload_to="book_images/")

    def __str__(self):
        return f"{self.book.name} image"