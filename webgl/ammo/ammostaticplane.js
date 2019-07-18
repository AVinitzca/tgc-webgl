class AmmoStaticPlane extends Ammo.btRigidBody
{
    constructor(planeNormal, planeConstant, transform)
    {
        var shape = new Ammo.btStaticPlaneShape(planeNormal.toAmmoVector(), planeConstant);

        var bulletTransform = new Ammo.btTransform();
        bulletTransform.setFromOpenGLMatrix(transform);

        var groundLocalInertia = Vector3.zero.toAmmoVector();
        var groundMotionState = new Ammo.btDefaultMotionState(transform);
        var constructionInfo = new Ammo.btRigidBodyConstructionInfo(0.0, groundMotionState, shape, groundLocalInertia);
        super(constructionInfo);
    }
}