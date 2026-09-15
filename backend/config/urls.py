from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from books import urls as book_urls
from accounts import urls as account_urls


def home(request):

    apis = []

    # Books APIs
    for pattern in book_urls.urlpatterns:

        api = {
            "name": pattern.name,
            "url": "/api/" + str(pattern.pattern),
        }

        api["url"] = api["url"].replace(
            "<int:pk>",
            "1"
        )

        apis.append(api)


    # Accounts APIs
    for pattern in account_urls.urlpatterns:

        api = {
            "name": pattern.name,
            "url": "/accounts/" + str(pattern.pattern),
        }

        apis.append(api)


    return render(
        request,
        "home.html",
        {
            "apis": apis
        }
    )


urlpatterns = [

    path("", home, name="home"),

    path("admin/", admin.site.urls),

    path("api/", include("books.urls")),
    path("accounts/",include("accounts.urls")),

]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )