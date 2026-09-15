from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self,phone_number,password=None,**extra_fields):
        if not phone_number:
            raise ValueError("The Phone Number must be set")

        user = self.model(phone_number=phone_number,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self,phone_number,password=None,**extra_fields):
        
        user = self.create_user(phone_number,password=password,**extra_fields)

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user

class User(AbstractUser):
    username = None
    email = None
    phone_number = models.CharField(max_length=15, unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'phone_number'

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.phone_number