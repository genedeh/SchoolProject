from django.urls import path
from . import views 


urlpatterns = [
    path("classrooms/<int:pk>/",views.ClassRoomRetrieveView.as_view(), name="classrooms-retireve"),
    path("offering-subjects/", views.OfferingSubjectsListView.as_view(), name="offering-subjects")
]
