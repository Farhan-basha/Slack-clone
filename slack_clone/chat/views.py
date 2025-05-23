from django.shortcuts import render

# Create your views here.
# from rest_framework import generics, permissions
# from .models import Channel, Message, Workspace, DirectMessageGroup
# from .serializers import ChannelSerializer, MessageSerializer, WorkspaceSerializer, DirectMessageGroupSerializer

# class WorkspaceListCreateView(generics.ListCreateAPIView):
#     queryset = Workspace.objects.all()
#     serializer_class = WorkspaceSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class ChannelListCreateView(generics.ListCreateAPIView):
#     queryset = Channel.objects.all()
#     serializer_class = ChannelSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class MessageListView(generics.ListAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         channel_id = self.kwargs.get("channel_id")
#         dm_group_id = self.kwargs.get("dm_group_id")
        
#         if channel_id:
#             return Message.objects.filter(channel_id=channel_id)
#         elif dm_group_id:
#             return Message.objects.filter(dm_group_id=dm_group_id)
#         return Message.objects.none()

from rest_framework import generics, permissions
from .models import Channel, Message, Workspace, DirectMessageGroup
from .serializers import ChannelSerializer, MessageSerializer, WorkspaceSerializer, DirectMessageGroupSerializer

# Workspace Views
class WorkspaceListCreateView(generics.ListCreateAPIView):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkspaceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

# Channel Views
class ChannelListCreateView(generics.ListCreateAPIView):
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        workspace_id = self.request.query_params.get('workspace_id')
        if workspace_id:
            return Channel.objects.filter(workspace_id=workspace_id)
        return Channel.objects.all()

class ChannelRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]

# DirectMessageGroup Views
class DirectMessageGroupListCreateView(generics.ListCreateAPIView):
    serializer_class = DirectMessageGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return DirectMessageGroup.objects.filter(participants=user)

class DirectMessageGroupRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DirectMessageGroup.objects.all()
    serializer_class = DirectMessageGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

# Message Views
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_id = self.kwargs.get('channel_id')
        dm_group_id = self.kwargs.get('dm_group_id')
        
        if channel_id:
            return Message.objects.filter(channel_id=channel_id)
        elif dm_group_id:
            return Message.objects.filter(dm_group_id=dm_group_id)
        return Message.objects.none()

    def perform_create(self, serializer):
        channel_id = self.kwargs.get('channel_id')
        dm_group_id = self.kwargs.get('dm_group_id')
        
        if channel_id:
            serializer.save(sender=self.request.user, channel_id=channel_id)
        elif dm_group_id:
            serializer.save(sender=self.request.user, dm_group_id=dm_group_id)

class MessageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

# chat/views.py
from django.shortcuts import render

def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name,
        'username': request.user.username  # assuming you're using Django auth
    })