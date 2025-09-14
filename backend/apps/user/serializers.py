from rest_framework import serializers
from apps.user.models import CustomUser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class CustomUserSerializer(serializers.ModelSerializer):
    # testing line.  -------------
    password2 = serializers.CharField(write_only = True)
    class Meta:
        model = CustomUser
        fields = ['id','email','first_name','last_name','phone','date_joined','avatar','password','password2']
        extra_kwargs = {
            'password':{'write_only':True}
        }
    def validate(self, data):
        if self.instance is None:
            if data['password'] != data['password2']:
                raise serializers.ValidationError("Password Can't Matched. ")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
    def update(self,instance, validated_data):
        password = validated_data.pop('password',None)
        validated_data.pop('password2',None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, request):
        user = authenticate(**request)
        if user:
            return user
        raise serializers.ValidationError("Wrong credential")





class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,data):
        user = authenticate(**data)

        if user:
            return user
        return serializers.ValidationError("Incorrect Credential!")
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token
